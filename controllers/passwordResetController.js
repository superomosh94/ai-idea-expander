const crypto = require('crypto');
const { User } = require('../models');
const { asyncHandler } = require('../middleware/errorMiddleware');
const { validatePassword } = require('../utils/validators');
const db = require('../config/database');

/**
 * Password Reset Controller
 * Handles forgot password and reset password functionality
 */

// Show forgot password form
exports.showForgotPassword = (req, res) => {
    res.render('auth/forgot-password', {
        title: 'Forgot Password',
        csrfToken: req.csrfToken()
    });
};

// Handle forgot password request
exports.forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.render('auth/forgot-password', {
            title: 'Forgot Password',
            errors: ['Please provide your email address'],
            csrfToken: req.csrfToken(),
            formData: { email }
        });
    }

    // Find user
    const user = await User.findOne({
        where: { email: email.toLowerCase().trim() }
    });

    // Always show success message (security best practice)
    // Don't reveal if email exists or not
    req.flash('success', 'If an account exists with that email, you will receive a password reset link shortly.');

    if (!user) {
        return res.redirect('/auth/login');
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Store token in database
    await db.query(
        `INSERT INTO password_reset_tokens (user_id, token, expires_at) 
         VALUES (?, ?, ?)`,
        [user.id, hashedToken, expiresAt]
    );

    // TODO: Send email with reset link
    // For development, you can log the reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/auth/reset-password/${resetToken}`;
    console.log('Password Reset URL:', resetUrl);
    console.log('User:', user.email);

    // In production, send email here using nodemailer or similar
    // await sendPasswordResetEmail(user.email, resetUrl);

    res.redirect('/auth/login');
});

// Show reset password form
exports.showResetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;

    if (!token) {
        req.flash('error', 'Invalid reset token');
        return res.redirect('/auth/forgot-password');
    }

    // Hash the token to compare with database
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Check if token exists and is valid
    const [tokens] = await db.query(
        `SELECT pr.*, u.email, u.name
         FROM password_reset_tokens pr
         JOIN users u ON pr.user_id = u.id
         WHERE pr.token = ? 
         AND pr.expires_at > NOW() 
         AND pr.used = false
         LIMIT 1`,
        [hashedToken]
    );

    if (!tokens || tokens.length === 0) {
        req.flash('error', 'Password reset token is invalid or has expired');
        return res.redirect('/auth/forgot-password');
    }

    res.render('auth/reset-password', {
        title: 'Reset Password',
        token: token,
        csrfToken: req.csrfToken()
    });
});

// Handle password reset
exports.resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password, password_confirm } = req.body;

    const errors = [];

    // Validate passwords
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
        errors.push(...passwordValidation.errors);
    }

    if (password !== password_confirm) {
        errors.push('Passwords do not match');
    }

    if (errors.length > 0) {
        return res.render('auth/reset-password', {
            title: 'Reset Password',
            token: token,
            errors,
            csrfToken: req.csrfToken()
        });
    }

    // Hash the token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find token and get user
    const [tokens] = await db.query(
        `SELECT pr.*, u.id as user_id
         FROM password_reset_tokens pr
         JOIN users u ON pr.user_id = u.id
         WHERE pr.token = ? 
         AND pr.expires_at > NOW() 
         AND pr.used = false
         LIMIT 1`,
        [hashedToken]
    );

    if (!tokens || tokens.length === 0) {
        req.flash('error', 'Password reset token is invalid or has expired');
        return res.redirect('/auth/forgot-password');
    }

    const tokenRecord = tokens[0];

    // Update user password
    const user = await User.findByPk(tokenRecord.user_id);
    user.password_hash = password; // This will be hashed by the model hook
    await user.save();

    // Mark token as used
    await db.query(
        'UPDATE password_reset_tokens SET used = true WHERE token = ?',
        [hashedToken]
    );

    req.flash('success', 'Password has been reset successfully. You can now login with your new password.');
    res.redirect('/auth/login');
});

module.exports = exports;
