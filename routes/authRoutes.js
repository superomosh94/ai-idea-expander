const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth, requireGuest } = require('../middleware/authMiddleware');

// Guest routes (not logged in)
router.get('/register', requireGuest, authController.showRegister);
router.post('/register', requireGuest, authController.register);
router.get('/login', requireGuest, authController.showLogin);
router.post('/login', requireGuest, authController.login);

// Password Reset routes
const passwordResetController = require('../controllers/passwordResetController');
router.get('/forgot-password', requireGuest, passwordResetController.showForgotPassword);
router.post('/forgot-password', requireGuest, passwordResetController.forgotPassword);
router.get('/reset-password/:token', requireGuest, passwordResetController.showResetPassword);
router.post('/reset-password/:token', requireGuest, passwordResetController.resetPassword);

// Authenticated routes
router.get('/logout', requireAuth, authController.logout);
router.get('/profile', requireAuth, authController.showProfile);
router.post('/profile', requireAuth, authController.updateProfile);
router.post('/change-password', requireAuth, authController.changePassword);

module.exports = router;
