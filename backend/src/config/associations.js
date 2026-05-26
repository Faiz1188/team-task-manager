/**
 * Defines all Sequelize associations between models and the ProjectMembers join table.
 * Import this once in server.js AFTER all models are defined.
 */
const { User } = require('../modules/users/user.model');
const { Project } = require('../modules/projects/project.model');
const { Task } = require('../modules/tasks/task.model');
const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

//  ProjectMembers join table 
const ProjectMember = sequelize.define(
  'ProjectMember',
  {
    projectId: { type: DataTypes.INTEGER, references: { model: 'projects', key: 'id' } },
    userId:    { type: DataTypes.INTEGER, references: { model: 'users',    key: 'id' } },
  },
  { tableName: 'project_members', timestamps: false }
);

//  Associations 
// Project  Owner
Project.belongsTo(User,    { as: 'owner',   foreignKey: 'ownerId' });
User.hasMany(Project,      { as: 'ownedProjects', foreignKey: 'ownerId' });

// Project  Members (many-to-many)
Project.belongsToMany(User,    { through: ProjectMember, as: 'members',  foreignKey: 'projectId' });
User.belongsToMany(Project,    { through: ProjectMember, as: 'projects', foreignKey: 'userId' });

// Task  Project
Task.belongsTo(Project, { as: 'project',      foreignKey: 'projectId' });
Project.hasMany(Task,   { as: 'tasks',        foreignKey: 'projectId' });

// Task  AssignedUser
Task.belongsTo(User,    { as: 'assignedUser', foreignKey: 'assignedUserId' });
User.hasMany(Task,      { as: 'assignedTasks',foreignKey: 'assignedUserId' });

module.exports = { ProjectMember };
