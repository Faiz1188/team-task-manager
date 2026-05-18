const { Router } = require('express');
const ctrl = require('./task.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const { requireRole } = require('../../middlewares/role.middleware');

const router = Router();
router.use(authMiddleware);

// GET /api/tasks?projectId=&assignedUserId=&status=
router.get('/', ctrl.getTasks);

// GET /api/tasks/dashboard
router.get('/dashboard', ctrl.getDashboard);

// POST /api/tasks  admin only
router.post('/', requireRole('admin'), ctrl.createTask);

// GET /api/tasks/:id
router.get('/:id', ctrl.getTask);

// PUT /api/tasks/:id  admin only (full update)
router.put('/:id', requireRole('admin'), ctrl.updateTask);

// PATCH /api/tasks/:id/status  member can update their own task status
router.patch('/:id/status', ctrl.updateTaskStatus);

// DELETE /api/tasks/:id  admin only
router.delete('/:id', requireRole('admin'), ctrl.deleteTask);

module.exports = router;
