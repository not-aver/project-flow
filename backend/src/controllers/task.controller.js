const { Task, Project, sequelize } = require('../models');

const STATUS_ORDER = ['TODO', 'IN_PROGRESS', 'DONE'];

const getStatusOrderLiteral = () =>
  sequelize.literal(
    `CASE ${STATUS_ORDER.map((status, index) => `WHEN status='${status}' THEN ${index}`).join(' ')} ELSE ${
      STATUS_ORDER.length
    } END`
  );

const ensureProjectOwnership = async (projectId, userId) => {
  const project = await Project.findOne({
    where: { id: projectId, ownerId: userId },
  });
  return project;
};

const getNextPosition = async (projectId, status) => {
  const maxPosition = await Task.max('position', {
    where: { projectId, status },
  });
  if (Number.isFinite(maxPosition) && maxPosition !== null) {
    return maxPosition + 1;
  }
  return 0;
};

const listTasks = async (req, res, next) => {
  try {
    const { projectId } = req.query;
    if (!projectId) {
      return res.status(400).json({ message: 'projectId query param is required' });
    }

    const project = await ensureProjectOwnership(projectId, req.user.id);
    if (!project) {
      return res.status(403).json({ message: 'Not allowed to view this project' });
    }

    const tasks = await Task.findAll({
      where: { projectId },
      order: [[getStatusOrderLiteral(), 'ASC'], ['position', 'ASC'], ['createdAt', 'ASC']],
    });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const { title, description, projectId, assigneeId, status = 'TODO' } = req.body;
    const project = await ensureProjectOwnership(projectId, req.user.id);
    if (!project) {
      return res.status(403).json({ message: 'Not allowed to use this project' });
    }
    const position = await getNextPosition(projectId, status);
    const task = await Task.create({
      title,
      description,
      status,
      projectId,
      assigneeId,
      position,
    });
    return res.status(201).json(task);
  } catch (error) {
    return next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    const project = await ensureProjectOwnership(task.projectId, req.user.id);
    if (!project) {
      return res.status(403).json({ message: 'Not allowed to update this task' });
    }

    const incomingStatus = req.body.status;
    task.title = req.body.title ?? task.title;
    task.description = req.body.description ?? task.description;
    task.assigneeId = req.body.assigneeId ?? task.assigneeId;

    if (incomingStatus && STATUS_ORDER.includes(incomingStatus) && incomingStatus !== task.status) {
      task.status = incomingStatus;
      task.position = await getNextPosition(task.projectId, incomingStatus);
    }

    if (typeof req.body.position === 'number') {
      task.position = req.body.position;
    }

    await task.save();
    return res.json(task);
  } catch (error) {
    return next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    const project = await ensureProjectOwnership(task.projectId, req.user.id);
    if (!project) {
      return res.status(403).json({ message: 'Not allowed to delete this task' });
    }

    await task.destroy();
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

const reorderTasks = async (req, res, next) => {
  const { projectId, updates } = req.body;
  if (!projectId || !Array.isArray(updates) || updates.length === 0) {
    return res.status(400).json({ message: 'projectId and updates array are required' });
  }

  try {
    const project = await ensureProjectOwnership(projectId, req.user.id);
    if (!project) {
      return res.status(403).json({ message: 'Not allowed to reorder tasks in this project' });
    }

    const taskIds = updates.map((item) => item.id);
    const tasks = await Task.findAll({
      where: { id: taskIds, projectId },
    });
    const taskMap = new Map(tasks.map((task) => [task.id, task]));

    await sequelize.transaction(async (transaction) => {
      for (const { id, status, position } of updates) {
        const task = taskMap.get(id);
        if (!task) {
          const error = new Error(`Task ${id} not found in project`);
          error.status = 404;
          throw error;
        }

        if (status && STATUS_ORDER.includes(status)) {
          task.status = status;
        }
        if (typeof position === 'number') {
          task.position = position;
        }

        await task.save({ transaction });
      }
    });

    const refreshedTasks = await Task.findAll({
      where: { projectId },
      order: [[getStatusOrderLiteral(), 'ASC'], ['position', 'ASC'], ['createdAt', 'ASC']],
    });

    return res.json(refreshedTasks);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  listTasks,
  createTask,
  updateTask,
  deleteTask,
  reorderTasks,
};

