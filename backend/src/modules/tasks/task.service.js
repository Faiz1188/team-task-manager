const { Op } = require('sequelize');
const { Task } = require('./task.model');
const { User } = require('../users/user.model');
const { Project } = require('../projects/project.model');
const { ProjectMember } = require('../../config/associations');

const userAttributes = ['id', 'name', 'email', 'role'];

const buildIncludes = () => [
  { model: User,    as: 'assignedUser', attributes: userAttributes },
  { model: Project, as: 'project',      attributes: ['id', 'name'] },
];

const isOverdue = (task) => {
  if (!task.dueDate || task.status === 'done') return false;
  return new Date(task.dueDate) < new Date(new Date().toDateString());
};

const formatTask = (task) => ({
  ...task.toJSON(),
  isOverdue: isOverdue(task),
});

const getTasks = async (user, query) => {
  const where = {};
  if (query.projectId) where.projectId = query.projectId;
  if (query.assignedUserId) where.assignedUserId = query.assignedUserId;
  if (query.status) where.status = query.status;

  // Members can only see tasks assigned to them or in their projects
  if (user.role === 'member') {
    const memberOf = await ProjectMember.findAll({ where: { userId: user.id } });
    const projectIds = memberOf.map((pm) => pm.projectId);
    where[Op.or] = [
      { assignedUserId: user.id },
      { projectId: { [Op.in]: projectIds } },
    ];
  }

  const tasks = await Task.findAll({ where, include: buildIncludes() });
  return tasks.map(formatTask);
};

const getTaskById = async (id) => {
  const task = await Task.findByPk(id, { include: buildIncludes() });
  if (!task) {
    const err = new Error('Task not found');
    err.statusCode = 404;
    throw err;
  }
  return formatTask(task);
};

const createTask = async (data) => {
  const task = await Task.create(data);
  return getTaskById(task.id);
};

const updateTask = async (id, data) => {
  const task = await Task.findByPk(id);
  if (!task) {
    const err = new Error('Task not found');
    err.statusCode = 404;
    throw err;
  }
  await task.update(data);
  return getTaskById(id);
};

const updateTaskStatus = async (id, status, requestingUser) => {
  const task = await Task.findByPk(id);
  if (!task) {
    const err = new Error('Task not found');
    err.statusCode = 404;
    throw err;
  }
  // Members can only update tasks assigned to them
  if (requestingUser.role === 'member' && task.assignedUserId !== requestingUser.id) {
    const err = new Error('You can only update status of tasks assigned to you');
    err.statusCode = 403;
    throw err;
  }
  await task.update({ status });
  return getTaskById(id);
};

const deleteTask = async (id) => {
  const task = await Task.findByPk(id);
  if (!task) {
    const err = new Error('Task not found');
    err.statusCode = 404;
    throw err;
  }
  await task.destroy();
};

const getDashboardStats = async (user) => {
  const where = {};
  if (user.role === 'member') {
    const memberOf = await ProjectMember.findAll({ where: { userId: user.id } });
    const projectIds = memberOf.map((pm) => pm.projectId);
    where[Op.or] = [
      { assignedUserId: user.id },
      { projectId: { [Op.in]: projectIds } },
    ];
  }

  const tasks = await Task.findAll({ where, include: buildIncludes() });
  const formatted = tasks.map(formatTask);

  return {
    total: formatted.length,
    todo: formatted.filter((t) => t.status === 'todo').length,
    inProgress: formatted.filter((t) => t.status === 'in-progress').length,
    done: formatted.filter((t) => t.status === 'done').length,
    overdue: formatted.filter((t) => t.isOverdue).length,
    tasks: formatted,
  };
};

module.exports = { getTasks, getTaskById, createTask, updateTask, updateTaskStatus, deleteTask, getDashboardStats };
