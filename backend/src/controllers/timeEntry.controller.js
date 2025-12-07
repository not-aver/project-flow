const { TimeEntry, Task, Project, sequelize } = require('../models');

const ensureTaskOwnership = async (taskId, userId) => {
  const task = await Task.findByPk(taskId, {
    include: [
      {
        model: Project,
        as: 'project',
        where: { ownerId: userId },
      },
    ],
  });
  return task;
};

const listTimeEntries = async (req, res, next) => {
  const { taskId, projectId } = req.query;
  if (!taskId && !projectId) {
    return res.status(400).json({ message: 'taskId or projectId query param is required' });
  }

  try {
    const where = {};
    const includeTask = {
      model: Task,
      as: 'task',
      attributes: ['id', 'title', 'projectId'],
    };

    if (taskId) {
      const task = await ensureTaskOwnership(taskId, req.user.id);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      where.taskId = taskId;
    }

    if (projectId) {
      const project = await Project.findOne({
        where: { id: projectId, ownerId: req.user.id },
      });
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      includeTask.where = { projectId };
    }

    const entries = await TimeEntry.findAll({
      where,
      order: [['startTime', 'DESC']],
      include: [includeTask],
    });
    return res.json(entries);
  } catch (error) {
    return next(error);
  }
};

const getActiveEntry = async (req, res, next) => {
  try {
    const entry = await TimeEntry.findOne({
      where: { userId: req.user.id, endTime: null },
      include: [
        {
          model: Task,
          as: 'task',
          attributes: ['id', 'title', 'projectId'],
        },
      ],
      order: [['startTime', 'DESC']],
    });
    return res.json(entry);
  } catch (error) {
    return next(error);
  }
};

const startTimer = async (req, res, next) => {
  try {
    const { taskId } = req.body;
    if (!taskId) {
      return res.status(400).json({ message: 'taskId is required' });
    }

    const task = await ensureTaskOwnership(taskId, req.user.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const activeEntry = await TimeEntry.findOne({
      where: { userId: req.user.id, endTime: null },
    });

    if (activeEntry) {
      activeEntry.endTime = new Date();
      await activeEntry.save();
    }

    const entry = await TimeEntry.create({
      taskId,
      userId: req.user.id,
      startTime: new Date(),
    });

    return res.status(201).json(entry);
  } catch (error) {
    return next(error);
  }
};

const stopTimer = async (req, res, next) => {
  try {
    const { entryId } = req.params;
    const entry = await TimeEntry.findOne({
      where: { id: entryId, userId: req.user.id, endTime: null },
    });

    if (!entry) {
      return res.status(404).json({ message: 'Active time entry not found' });
    }

    entry.endTime = new Date();
    await entry.save();
    return res.json(entry);
  } catch (error) {
    return next(error);
  }
};

const createManualEntry = async (req, res, next) => {
  try {
    const { taskId, startTime, endTime, durationSeconds, note } = req.body;

    if (!taskId || !startTime) {
      return res.status(400).json({ message: 'taskId and startTime are required' });
    }

    const task = await ensureTaskOwnership(taskId, req.user.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const entry = await TimeEntry.create({
      taskId,
      userId: req.user.id,
      startTime: new Date(startTime),
      endTime: endTime ? new Date(endTime) : null,
      durationSeconds,
      note,
    });

    return res.status(201).json(entry);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  listTimeEntries,
  getActiveEntry,
  startTimer,
  stopTimer,
  createManualEntry,
};

