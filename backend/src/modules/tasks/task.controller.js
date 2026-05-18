const taskService = require('./task.service');

const getTasks = async (req, res, next) => {
  try {
    const tasks = await taskService.getTasks(req.user, req.query);
    res.json({ success: true, message: 'Tasks retrieved', data: tasks });
  } catch (err) { next(err); }
};

const getTask = async (req, res, next) => {
  try {
    const task = await taskService.getTaskById(req.params.id);
    res.json({ success: true, message: 'Task retrieved', data: task });
  } catch (err) { next(err); }
};

const createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.body);
    res.status(201).json({ success: true, message: 'Task created', data: task });
  } catch (err) { next(err); }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.body);
    res.json({ success: true, message: 'Task updated', data: task });
  } catch (err) { next(err); }
};

const updateTaskStatus = async (req, res, next) => {
  try {
    const task = await taskService.updateTaskStatus(req.params.id, req.body.status, req.user);
    res.json({ success: true, message: 'Status updated', data: task });
  } catch (err) { next(err); }
};

const deleteTask = async (req, res, next) => {
  try {
    await taskService.deleteTask(req.params.id);
    res.json({ success: true, message: 'Task deleted', data: null });
  } catch (err) { next(err); }
};

const getDashboard = async (req, res, next) => {
  try {
    const stats = await taskService.getDashboardStats(req.user);
    res.json({ success: true, message: 'Dashboard data', data: stats });
  } catch (err) { next(err); }
};

module.exports = { getTasks, getTask, createTask, updateTask, updateTaskStatus, deleteTask, getDashboard };
