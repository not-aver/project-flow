const express = require('express');
const authRequired = require('../middleware/auth');
const taskController = require('../controllers/task.controller');

const router = express.Router();

router.use(authRequired);

router.get('/', taskController.listTasks);
router.post('/', taskController.createTask);
router.post('/reorder', taskController.reorderTasks);
router.put('/:taskId', taskController.updateTask);
router.delete('/:taskId', taskController.deleteTask);

module.exports = router;

