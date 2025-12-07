/**
 * Authentication Middleware
 * Protects routes and ensures user is authenticated
 */

const requireAuth = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'Please log in to access this page');
        return res.redirect('/auth/login');
    }
    next();
};

const requireGuest = (req, res, next) => {
    if (req.session && req.session.user) {
        return res.redirect('/ideas/dashboard');
    }
    next();
};

const requireAdmin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'Please log in to access this page');
        return res.redirect('/auth/login');
    }

    if (req.session.user.role !== 'admin') {
        req.flash('error', 'Access denied. Admin privileges required.');
        return res.redirect('/ideas/dashboard');
    }

    next();
};

// API authentication middleware
const requireApiAuth = (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }
    next();
};

module.exports = {
    requireAuth,
    requireGuest,
    requireAdmin,
    requireApiAuth
};
