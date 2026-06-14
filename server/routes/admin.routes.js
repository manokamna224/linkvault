const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

const guard = [authMiddleware, requireRole('admin', 'moderator')];

router.get('/queue', ...guard, adminController.getQueue);
router.patch('/links/:id/approve', ...guard, adminController.approveLink);
router.patch('/links/:id/reject', ...guard, adminController.rejectLink);
router.delete('/links/:id', authMiddleware, requireRole('admin'), adminController.deleteLink);
router.get('/stats', ...guard, adminController.getStats);

module.exports = router;
