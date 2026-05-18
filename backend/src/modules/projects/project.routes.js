const { Router } = require('express');
const ctrl = require('./project.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const { requireRole } = require('../../middlewares/role.middleware');

const router = Router();
router.use(authMiddleware);

// GET /api/projects  all authenticated
router.get('/', ctrl.getProjects);

// POST /api/projects  admin only
router.post('/', requireRole('admin'), ctrl.createProject);

// GET /api/projects/:id  all authenticated
router.get('/:id', ctrl.getProject);

// PUT /api/projects/:id  admin only
router.put('/:id', requireRole('admin'), ctrl.updateProject);

// DELETE /api/projects/:id  admin only
router.delete('/:id', requireRole('admin'), ctrl.deleteProject);

// POST /api/projects/:id/members  admin only (body: { userId })
router.post('/:id/members', requireRole('admin'), ctrl.addMember);

// DELETE /api/projects/:id/members/:uid  admin only
router.delete('/:id/members/:uid', requireRole('admin'), ctrl.removeMember);

module.exports = router;
