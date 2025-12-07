const { VALIDATION } = require('../config/constants');

/**
 * Validation utilities
 */

/**
 * Validate email format
 */
function validateEmail(email) {
    if (!email || typeof email !== 'string') {
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

/**
 * Validate password strength
 */
function validatePassword(password) {
    const errors = [];

    if (!password || typeof password !== 'string') {
        return {
            valid: false,
            errors: ['Password is required']
        };
    }

    if (password.length < VALIDATION.MIN_PASSWORD_LENGTH) {
        errors.push(`Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters long`);
    }

    if (password.length > VALIDATION.MAX_PASSWORD_LENGTH) {
        errors.push(`Password must not exceed ${VALIDATION.MAX_PASSWORD_LENGTH} characters`);
    }

    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }

    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }

    // Check for at least one number
    if (!/\d/.test(password)) {
        errors.push('Password must contain at least one number');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Sanitize HTML to prevent XSS
 */
function sanitizeHtml(text) {
    if (!text) return '';

    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;'
    };

    return text.replace(/[&<>"'/]/g, (char) => map[char]);
}

/**
 * Validate idea title
 */
function validateIdeaTitle(title) {
    const errors = [];

    if (!title || typeof title !== 'string') {
        errors.push('Title is required');
        return { valid: false, errors };
    }

    const trimmedTitle = title.trim();

    if (trimmedTitle.length < VALIDATION.MIN_TITLE_LENGTH) {
        errors.push(`Title must be at least ${VALIDATION.MIN_TITLE_LENGTH} characters long`);
    }

    if (trimmedTitle.length > VALIDATION.MAX_TITLE_LENGTH) {
        errors.push(`Title must not exceed ${VALIDATION.MAX_TITLE_LENGTH} characters`);
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Validate idea content
 */
function validateIdeaContent(content) {
    const errors = [];

    if (!content || typeof content !== 'string') {
        errors.push('Idea content is required');
        return { valid: false, errors };
    }

    const trimmedContent = content.trim();

    if (trimmedContent.length < VALIDATION.MIN_IDEA_LENGTH) {
        errors.push(`Idea must be at least ${VALIDATION.MIN_IDEA_LENGTH} characters long`);
    }

    if (trimmedContent.length > VALIDATION.MAX_IDEA_LENGTH) {
        errors.push(`Idea must not exceed ${VALIDATION.MAX_IDEA_LENGTH} characters`);
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

module.exports = {
    validateEmail,
    validatePassword,
    sanitizeHtml,
    validateIdeaTitle,
    validateIdeaContent
};
