const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAdmin } = require('../middleware/authMiddleware');

// All admin routes require admin authentication
router.use(requireAdmin);

// Dashboard
router.get('/dashboard', adminController.showDashboard);

// User Management
router.get('/users', adminController.showUsers);
router.post('/users/:userId/toggle-status', adminController.toggleUserStatus);
router.post('/users/:userId/delete', adminController.deleteUser);

// Idea Management
router.get('/ideas', adminController.showIdeas);
router.post('/ideas/:ideaId/delete', adminController.deleteIdea);

// Statistics
router.get('/statistics', adminController.showStatistics);

module.exports = router;
