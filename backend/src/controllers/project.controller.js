const { Project } = require('../models');

const listProjects = async (req, res, next) => {
  try {
    const projects = await Project.findAll({ where: { ownerId: req.user.id } });
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

const createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const project = await Project.create({
      name,
      description,
      ownerId: req.user.id,
    });
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      where: { id: req.params.projectId, ownerId: req.user.id },
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.name = req.body.name ?? project.name;
    project.description = req.body.description ?? project.description;
    await project.save();

    return res.json(project);
  } catch (error) {
    return next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      where: { id: req.params.projectId, ownerId: req.user.id },
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await project.destroy();
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

const getProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      where: { id: req.params.projectId, ownerId: req.user.id },
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    return res.json(project);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
};

