const projectService = require('./project.service');

const getProjects = async (req, res, next) => {
  try {
    const projects = await projectService.getProjectsForUser(req.user);
    res.json({ success: true, message: 'Projects retrieved', data: projects });
  } catch (err) { next(err); }
};

const getProject = async (req, res, next) => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    res.json({ success: true, message: 'Project retrieved', data: project });
  } catch (err) { next(err); }
};

const createProject = async (req, res, next) => {
  try {
    const project = await projectService.createProject(req.body, req.user.id);
    res.status(201).json({ success: true, message: 'Project created', data: project });
  } catch (err) { next(err); }
};

const updateProject = async (req, res, next) => {
  try {
    const project = await projectService.updateProject(req.params.id, req.body);
    res.json({ success: true, message: 'Project updated', data: project });
  } catch (err) { next(err); }
};

const deleteProject = async (req, res, next) => {
  try {
    await projectService.deleteProject(req.params.id);
    res.json({ success: true, message: 'Project deleted', data: null });
  } catch (err) { next(err); }
};

const addMember = async (req, res, next) => {
  try {
    const project = await projectService.addMember(req.params.id, req.body.userId);
    res.json({ success: true, message: 'Member added', data: project });
  } catch (err) { next(err); }
};

const removeMember = async (req, res, next) => {
  try {
    const project = await projectService.removeMember(req.params.id, req.params.uid);
    res.json({ success: true, message: 'Member removed', data: project });
  } catch (err) { next(err); }
};

module.exports = { getProjects, getProject, createProject, updateProject, deleteProject, addMember, removeMember };
