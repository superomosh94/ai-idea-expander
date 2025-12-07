const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const ideaController = require('../controllers/ideaController');
const { requireAuth } = require('../middleware/authMiddleware');

const csrfProtection = csrf({ cookie: true });

// All idea routes require authentication
router.use(requireAuth);

// Dashboard
router.get('/dashboard', ideaController.showDashboard);

// Create idea
router.get('/create', csrfProtection, ideaController.showCreateForm);
router.post('/create', csrfProtection, ideaController.createIdea);

// Expand idea
router.get('/:id/expand', csrfProtection, ideaController.showExpandForm);
router.post('/:id/expand', csrfProtection, ideaController.expandIdea);

// View idea
router.get('/:id', ideaController.showIdea);

// Edit idea
router.get('/:id/edit', csrfProtection, ideaController.showEditForm);
router.post('/:id/edit', csrfProtection, ideaController.updateIdea);

// Delete idea
router.post('/:id/delete', csrfProtection, ideaController.deleteIdea);

// Toggle favorite (AJAX)
router.post('/:id/favorite', ideaController.toggleFavorite);

module.exports = router;
