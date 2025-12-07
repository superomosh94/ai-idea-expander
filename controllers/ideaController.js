const ideaService = require('../services/ideaService');
const { asyncHandler } = require('../middleware/errorMiddleware');
const { VALIDATION } = require('../config/constants');

/**
 * Idea Controller
 * Handles web-based idea operations
 */

// Show dashboard
exports.showDashboard = asyncHandler(async (req, res) => {
    const userId = req.session.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = 12;
    const offset = (page - 1) * limit;

    const search = req.query.search ? req.query.search.trim() : '';
    const status = req.query.status || '';

    const result = await ideaService.getUserIdeas(userId, {
        search,
        status,
        limit,
        offset,
        orderBy: 'created_at',
        orderDir: 'DESC'
    });

    const stats = await ideaService.getUserStats(userId);

    const totalPages = Math.ceil(result.total / limit);

    res.render('ideas/dashboard', {
        title: 'Dashboard',
        ideas: result.ideas,
        stats,
        pagination: {
            currentPage: page,
            totalPages,
            total: result.total,
            limit
        },
        filters: {
            search,
            status
        },
        csrfToken: null
    });
});

// Show create idea form
exports.showCreateForm = (req, res) => {
    // Check if we have pre-filled data from generator (query params)
    const { title, raw_idea } = req.query;

    res.render('ideas/create', {
        title: 'Create New Idea',
        csrfToken: req.csrfToken(),
        // Initialize formData with query params if available, or empty object
        formData: title || raw_idea ? { title, raw_idea } : {},
        // If coming from generator, show success indicator
        generated: !!(title || raw_idea)
    });
};

// Show generator form
exports.showGenerator = (req, res) => {
    res.render('ideas/generator', {
        title: 'AI Idea Generator',
        csrfToken: req.csrfToken(),
        ideas: null,
        context: ''
    });
};

// Handle idea generation
exports.handleGenerateIdeas = asyncHandler(async (req, res) => {
    const { context } = req.body;
    const groqService = require('../services/groqService');

    if (!context || context.trim().length === 0) {
        req.flash('error', 'Please provide a context or field.');
        return res.redirect('/ideas/generate');
    }

    try {
        const ideas = await groqService.generateIdeasFromContext(context);

        res.render('ideas/generator', {
            title: 'AI Idea Generator',
            csrfToken: req.csrfToken(),
            ideas,
            context
        });
    } catch (error) {
        req.flash('error', 'Failed to generate ideas. Please try again.');
        res.redirect('/ideas/generate');
    }
});

// Create new idea
exports.createIdea = asyncHandler(async (req, res) => {
    const { title, raw_idea } = req.body;
    const userId = req.session.user.id;

    const errors = [];

    if (!title || title.trim().length < VALIDATION.MIN_TITLE_LENGTH) {
        errors.push(`Title must be at least ${VALIDATION.MIN_TITLE_LENGTH} characters long`);
    }

    if (title && title.length > VALIDATION.MAX_TITLE_LENGTH) {
        errors.push(`Title must not exceed ${VALIDATION.MAX_TITLE_LENGTH} characters`);
    }

    if (!raw_idea || raw_idea.trim().length < VALIDATION.MIN_IDEA_LENGTH) {
        errors.push(`Idea must be at least ${VALIDATION.MIN_IDEA_LENGTH} characters long`);
    }

    if (raw_idea && raw_idea.length > VALIDATION.MAX_IDEA_LENGTH) {
        errors.push(`Idea must not exceed ${VALIDATION.MAX_IDEA_LENGTH} characters`);
    }

    if (errors.length > 0) {
        return res.render('ideas/create', {
            title: 'Create New Idea',
            errors,
            csrfToken: req.csrfToken(),
            formData: { title, raw_idea }
        });
    }

    const idea = await ideaService.createIdea(userId, title.trim(), raw_idea.trim());

    req.flash('success', 'Idea created successfully!');
    res.redirect(`/ideas/${idea.id}/expand`);
});

// Show expand confirmation
exports.showExpandForm = asyncHandler(async (req, res) => {
    const ideaId = req.params.id;
    const userId = req.session.user.id;

    const idea = await ideaService.getIdeaById(ideaId, userId);

    if (!idea) {
        req.flash('error', 'Idea not found');
        return res.redirect('/ideas/dashboard');
    }

    res.render('ideas/expand', {
        title: 'Expand Idea',
        idea,
        csrfToken: req.csrfToken()
    });
});

// Expand idea with AI
exports.expandIdea = asyncHandler(async (req, res) => {
    const ideaId = req.params.id;
    const userId = req.session.user.id;

    try {
        const idea = await ideaService.expandIdea(ideaId, userId);
        req.flash('success', 'Idea expanded successfully!');
        res.redirect(`/ideas/${idea.id}`);
    } catch (error) {
        req.flash('error', error.message || 'Failed to expand idea');
        res.redirect(`/ideas/${ideaId}/expand`);
    }
});

// Show idea details
exports.showIdea = asyncHandler(async (req, res) => {
    const ideaId = req.params.id;
    const userId = req.session.user.id;

    const idea = await ideaService.getIdeaById(ideaId, userId);

    if (!idea) {
        req.flash('error', 'Idea not found');
        return res.redirect('/ideas/dashboard');
    }

    res.render('ideas/view', {
        title: idea.title,
        idea,
        csrfToken: null
    });
});

// Show edit form
exports.showEditForm = asyncHandler(async (req, res) => {
    const ideaId = req.params.id;
    const userId = req.session.user.id;

    const idea = await ideaService.getIdeaById(ideaId, userId);

    if (!idea) {
        req.flash('error', 'Idea not found');
        return res.redirect('/ideas/dashboard');
    }

    res.render('ideas/edit', {
        title: 'Edit Idea',
        idea,
        csrfToken: req.csrfToken()
    });
});

// Update idea
exports.updateIdea = asyncHandler(async (req, res) => {
    const ideaId = req.params.id;
    const userId = req.session.user.id;
    const { title, raw_idea } = req.body;

    const errors = [];

    if (!title || title.trim().length < VALIDATION.MIN_TITLE_LENGTH) {
        errors.push(`Title must be at least ${VALIDATION.MIN_TITLE_LENGTH} characters long`);
    }

    if (title && title.length > VALIDATION.MAX_TITLE_LENGTH) {
        errors.push(`Title must not exceed ${VALIDATION.MAX_TITLE_LENGTH} characters`);
    }

    if (errors.length > 0) {
        const idea = await ideaService.getIdeaById(ideaId, userId);
        return res.render('ideas/edit', {
            title: 'Edit Idea',
            errors,
            idea,
            csrfToken: req.csrfToken()
        });
    }

    await ideaService.updateIdea(ideaId, userId, {
        title: title.trim(),
        raw_idea: raw_idea ? raw_idea.trim() : undefined
    });

    // Check if re-expansion was requested
    if (req.body.reexpand === 'true') {
        try {
            await ideaService.expandIdea(ideaId, userId);
            req.flash('success', 'Idea updated and re-expanded successfully!');
        } catch (error) {
            req.flash('warning', 'Idea updated, but AI re-expansion failed: ' + error.message);
        }
    } else {
        req.flash('success', 'Idea updated successfully');
    }

    res.redirect(`/ideas/${ideaId}`);
});

// Delete idea
exports.deleteIdea = asyncHandler(async (req, res) => {
    const ideaId = req.params.id;
    const userId = req.session.user.id;

    await ideaService.deleteIdea(ideaId, userId);

    req.flash('success', 'Idea deleted successfully');
    res.redirect('/ideas/dashboard');
});

// Toggle favorite
exports.toggleFavorite = asyncHandler(async (req, res) => {
    const ideaId = req.params.id;
    const userId = req.session.user.id;

    const idea = await ideaService.toggleFavorite(ideaId, userId);

    res.json({
        success: true,
        is_favorite: idea.is_favorite
    });
});
