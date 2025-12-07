module.exports = {
    // Section types for idea expansion
    SECTION_TYPES: {
        PROBLEM: 'problem',
        USERS: 'users',
        FEATURES: 'features',
        WORKFLOW: 'workflow',
        RISKS: 'risks',
        METRICS: 'metrics'
    },

    // User roles
    USER_ROLES: {
        USER: 'user',
        ADMIN: 'admin'
    },

    // Idea status
    IDEA_STATUS: {
        DRAFT: 'draft',
        EXPANDED: 'expanded',
        ARCHIVED: 'archived'
    },

    // Pagination
    PAGINATION: {
        DEFAULT_LIMIT: 10,
        MAX_LIMIT: 50
    },

    // Groq API
    GROQ: {
        MODEL: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
        MAX_TOKENS: parseInt(process.env.GROQ_MAX_TOKENS) || 2000,
        TEMPERATURE: parseFloat(process.env.GROQ_TEMPERATURE) || 0.7,
        TIMEOUT: 30000 // 30 seconds
    },

    // Validation
    VALIDATION: {
        MIN_PASSWORD_LENGTH: 8,
        MAX_PASSWORD_LENGTH: 128,
        MIN_IDEA_LENGTH: 10,
        MAX_IDEA_LENGTH: 1000,
        MIN_TITLE_LENGTH: 3,
        MAX_TITLE_LENGTH: 200
    }
};
