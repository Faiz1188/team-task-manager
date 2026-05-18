const { Router } = require('express');
const { getAllUsers, getMe, getUserById } = require('./user.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const { requireRole } = require('../../middlewares/role.middleware');

const router = Router();

// All user routes require authentication
router.use(authMiddleware);

// GET /api/users/me  current user profile
router.get('/me', getMe);

// GET /api/users  admin only
router.get('/', requireRole('admin'), getAllUsers);

// GET /api/users/:id  admin only
router.get('/:id', requireRole('admin'), getUserById);

module.exports = router;
