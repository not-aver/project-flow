const express = require('express');
const authRequired = require('../middleware/auth');
const projectController = require('../controllers/project.controller');

const router = express.Router();

router.use(authRequired);

router.get('/', projectController.listProjects);
router.get('/:projectId', projectController.getProject);
router.post('/', projectController.createProject);
router.put('/:projectId', projectController.updateProject);
router.delete('/:projectId', projectController.deleteProject);

module.exports = router;

