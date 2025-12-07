const express = require('express');
const authRoutes = require('./auth.routes');
const projectRoutes = require('./project.routes');
const taskRoutes = require('./task.routes');
const commentRoutes = require('./comment.routes');
const timeEntryRoutes = require('./timeEntry.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);
router.use('/comments', commentRoutes);
router.use('/time-entries', timeEntryRoutes);

module.exports = router;

