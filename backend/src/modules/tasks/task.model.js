const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const Task = sequelize.define(
  'Task',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: 'Task title is required' } },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '',
    },
    status: {
      type: DataTypes.ENUM('todo', 'in-progress', 'done'),
      allowNull: false,
      defaultValue: 'todo',
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    assignedUserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: 'tasks',
    timestamps: true,
  }
);

module.exports = { Task };
