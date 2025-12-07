const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const apiController = require('../controllers/apiController');
const { requireApiAuth } = require('../middleware/authMiddleware');

// Rate limiting for API
const apiLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: {
        success: false,
        message: 'Too many requests, please try again later.'
    }
});

// Apply rate limiting to all API routes
router.use(apiLimiter);

// All API routes require authentication
router.use(requireApiAuth);

// Idea expansion
router.post('/expand', apiController.expandIdea);
router.post('/expand-prompt', apiController.expandPrompt);

// Idea management
router.get('/ideas', apiController.getIdeas);
router.post('/ideas', apiController.createIdea);
router.get('/ideas/:id', apiController.getIdea);
router.put('/ideas/:id', apiController.updateIdea);
router.delete('/ideas/:id', apiController.deleteIdea);

// Statistics
router.get('/stats', apiController.getStats);

// Test connection
router.get('/test-connection', apiController.testConnection);

module.exports = router;
