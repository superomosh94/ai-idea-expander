const { User } = require('../models');
const { asyncHandler } = require('../middleware/errorMiddleware');
const { validateEmail, validatePassword } = require('../utils/validators');

/**
 * Authentication Controller
 * Handles user registration, login, and logout
 */

// Show registration form
exports.showRegister = (req, res) => {
    res.render('auth/register', {
        title: 'Register',
        csrfToken: req.csrfToken()
    });
};

// Handle registration
exports.register = asyncHandler(async (req, res) => {
    const { name, email, password, password_confirm } = req.body;

    // Validation
    const errors = [];

    if (!name || name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }

    if (!validateEmail(email)) {
        errors.push('Please provide a valid email address');
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
        errors.push(...passwordValidation.errors);
    }

    if (password !== password_confirm) {
        errors.push('Passwords do not match');
    }

    if (errors.length > 0) {
        return res.render('auth/register', {
            title: 'Register',
            errors,
            csrfToken: req.csrfToken(),
            formData: { name, email }
        });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        return res.render('auth/register', {
            title: 'Register',
            errors: ['Email already registered'],
            csrfToken: req.csrfToken(),
            formData: { name, email }
        });
    }

    // Create user
    const user = await User.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password_hash: password
    });

    // Set session
    req.session.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    };

    req.flash('success', 'Registration successful! Welcome to AI Idea Expander.');
    res.redirect('/ideas/dashboard');
});

// Show login form
exports.showLogin = (req, res) => {
    res.render('auth/login', {
        title: 'Login',
        csrfToken: req.csrfToken()
    });
};

// Handle login
exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
        return res.render('auth/login', {
            title: 'Login',
            errors: ['Please provide email and password'],
            csrfToken: req.csrfToken(),
            formData: { email }
        });
    }

    // Find user
    const user = await User.findOne({
        where: { email: email.toLowerCase().trim() }
    });

    if (!user) {
        return res.render('auth/login', {
            title: 'Login',
            errors: ['Invalid email or password'],
            csrfToken: req.csrfToken(),
            formData: { email }
        });
    }

    // Check if account is active
    if (!user.is_active) {
        return res.render('auth/login', {
            title: 'Login',
            errors: ['Your account has been deactivated. Please contact support.'],
            csrfToken: req.csrfToken(),
            formData: { email }
        });
    }

    // Validate password
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
        return res.render('auth/login', {
            title: 'Login',
            errors: ['Invalid email or password'],
            csrfToken: req.csrfToken(),
            formData: { email }
        });
    }

    // Update last login
    user.last_login = new Date();
    await user.save();

    // Set session
    req.session.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    };

    req.flash('success', `Welcome back, ${user.name}!`);
    console.log('User Role:', user.role); // Debugging log
    if (user.role === 'admin') {
        return res.redirect('/admin/dashboard');
    }

    res.redirect('/ideas/dashboard');
});

// Handle logout
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/');
    });
};

// Show profile page
exports.showProfile = asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.session.user.id, {
        attributes: { exclude: ['password_hash'] }
    });

    res.render('auth/profile', {
        title: 'My Profile',
        user,
        csrfToken: req.csrfToken()
    });
});

// Update profile
exports.updateProfile = asyncHandler(async (req, res) => {
    const { name, email } = req.body;
    const user = await User.findByPk(req.session.user.id);

    const errors = [];

    if (!name || name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }

    if (!validateEmail(email)) {
        errors.push('Please provide a valid email address');
    }

    // Check if email is already taken by another user
    if (email !== user.email) {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            errors.push('Email already in use by another account');
        }
    }

    if (errors.length > 0) {
        return res.render('auth/profile', {
            title: 'My Profile',
            errors,
            user,
            csrfToken: req.csrfToken()
        });
    }

    user.name = name.trim();
    user.email = email.toLowerCase().trim();
    await user.save();

    // Update session
    req.session.user.name = user.name;
    req.session.user.email = user.email;

    req.flash('success', 'Profile updated successfully');
    res.redirect('/auth/profile');
});

// Change password
exports.changePassword = asyncHandler(async (req, res) => {
    const { current_password, new_password, new_password_confirm } = req.body;
    const user = await User.findByPk(req.session.user.id);

    const errors = [];

    // Validate current password
    const isCurrentPasswordValid = await user.validatePassword(current_password);
    if (!isCurrentPasswordValid) {
        errors.push('Current password is incorrect');
    }

    // Validate new password
    const passwordValidation = validatePassword(new_password);
    if (!passwordValidation.valid) {
        errors.push(...passwordValidation.errors);
    }

    if (new_password !== new_password_confirm) {
        errors.push('New passwords do not match');
    }

    if (errors.length > 0) {
        return res.render('auth/profile', {
            title: 'My Profile',
            errors,
            user,
            csrfToken: req.csrfToken()
        });
    }

    user.password_hash = new_password;
    await user.save();

    req.flash('success', 'Password changed successfully');
    res.redirect('/auth/profile');
});
