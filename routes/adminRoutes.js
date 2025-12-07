const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAdmin } = require('../middleware/authMiddleware');
const csrf = require('csurf');

const csrfProtection = csrf({ cookie: true });

// All admin routes require admin authentication
router.use(requireAdmin);

// Dashboard
// Apply csrfProtection to routes that render forms or handle POST requests
router.get('/dashboard', adminController.showDashboard);

// User Management
router.get('/users', csrfProtection, adminController.showUsers);
router.post('/users/:userId/toggle-status', csrfProtection, adminController.toggleUserStatus);
router.post('/users/:userId/delete', csrfProtection, adminController.deleteUser);

// Idea Management
router.get('/ideas', csrfProtection, adminController.showIdeas);
router.post('/ideas/:ideaId/delete', csrfProtection, adminController.deleteIdea);

// Statistics
router.get('/statistics', adminController.showStatistics);

module.exports = router;
