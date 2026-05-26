const { Op } = require('sequelize');
const { Project } = require('./project.model');
const { User } = require('../users/user.model');
const { ProjectMember } = require('../../config/associations');

const userAttributes = ['id', 'name', 'email', 'role'];

const getProjectsForUser = async (user) => {
  if (user.role === 'admin') {
    return Project.findAll({
      include: [
        { model: User, as: 'owner', attributes: userAttributes },
        { model: User, as: 'members', attributes: userAttributes, through: { attributes: [] } },
      ],
    });
  }
  // Members only see projects they belong to
  const memberOf = await ProjectMember.findAll({ where: { userId: user.id } });
  const projectIds = memberOf.map((pm) => pm.projectId);
  return Project.findAll({
    where: { id: { [Op.in]: projectIds } },
    include: [
      { model: User, as: 'owner', attributes: userAttributes },
      { model: User, as: 'members', attributes: userAttributes, through: { attributes: [] } },
    ],
  });
};

const getProjectById = async (id) => {
  const project = await Project.findByPk(id, {
    include: [
      { model: User, as: 'owner', attributes: userAttributes },
      { model: User, as: 'members', attributes: userAttributes, through: { attributes: [] } },
    ],
  });
  if (!project) {
    const err = new Error('Project not found');
    err.statusCode = 404;
    throw err;
  }
  return project;
};

const createProject = async ({ name, description }, ownerId) => {
  const project = await Project.create({ name, description, ownerId });
  // Add owner as a member automatically
  await ProjectMember.create({ projectId: project.id, userId: ownerId });
  return getProjectById(project.id);
};

const updateProject = async (id, updates) => {
  const project = await getProjectById(id);
  await project.update(updates);
  return getProjectById(id);
};

const deleteProject = async (id) => {
  const project = await getProjectById(id);
  await project.destroy();
};

const addMember = async (projectId, userId) => {
  await getProjectById(projectId);
  const user = await User.findByPk(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  const existing = await ProjectMember.findOne({ where: { projectId, userId } });
  if (existing) {
    const err = new Error('User is already a member of this project');
    err.statusCode = 409;
    throw err;
  }
  await ProjectMember.create({ projectId, userId });
  return getProjectById(projectId);
};

const removeMember = async (projectId, userId) => {
  const record = await ProjectMember.findOne({ where: { projectId, userId } });
  if (!record) {
    const err = new Error('Member not found in this project');
    err.statusCode = 404;
    throw err;
  }
  await record.destroy();
  return getProjectById(projectId);
};

module.exports = {
  getProjectsForUser,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
};
