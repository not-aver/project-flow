const { Comment, Task, Project } = require('../models');

const listComments = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    
    // Проверяем, что задача существует и пользователь имеет доступ к проекту
    const task = await Task.findOne({
      where: { id: taskId },
      include: [
        {
          model: Project,
          as: 'project',
          where: { ownerId: req.user.id },
        },
      ],
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const comments = await Comment.findAll({
      where: { taskId },
      include: [
        {
          model: require('../models').User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['createdAt', 'ASC']],
    });

    res.json(comments);
  } catch (error) {
    next(error);
  }
};

const createComment = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { text } = req.body;

    // Проверяем доступ к задаче
    const task = await Task.findOne({
      where: { id: taskId },
      include: [
        {
          model: Project,
          as: 'project',
          where: { ownerId: req.user.id },
        },
      ],
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const comment = await Comment.create({
      text,
      taskId,
      userId: req.user.id,
    });

    const commentWithUser = await Comment.findByPk(comment.id, {
      include: [
        {
          model: require('../models').User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    res.status(201).json(commentWithUser);
  } catch (error) {
    next(error);
  }
};

const updateComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findOne({
      where: { id: commentId, userId: req.user.id },
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    comment.text = req.body.text ?? comment.text;
    await comment.save();

    const commentWithUser = await Comment.findByPk(comment.id, {
      include: [
        {
          model: require('../models').User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    res.json(commentWithUser);
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findOne({
      where: { id: commentId, userId: req.user.id },
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    await comment.destroy();
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listComments,
  createComment,
  updateComment,
  deleteComment,
};

