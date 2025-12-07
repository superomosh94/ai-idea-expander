const ideaService = require('../services/ideaService');
const groqService = require('../services/groqService');
const { asyncHandler } = require('../middleware/errorMiddleware');

/**
 * API Controller
 * Handles RESTful API endpoints
 */

// Expand idea via API
exports.expandIdea = asyncHandler(async (req, res) => {
    const { idea_id } = req.body;
    const userId = req.session.user.id;

    if (!idea_id) {
        return res.status(400).json({
            success: false,
            message: 'Idea ID is required'
        });
    }

    try {
        const idea = await ideaService.expandIdea(idea_id, userId);

        res.json({
            success: true,
            message: 'Idea expanded successfully',
            data: idea
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// Expand custom prompt via API (for follow-up prompts)
exports.expandPrompt = asyncHandler(async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({
            success: false,
            message: 'Prompt is required'
        });
    }

    try {
        // Call Groq API with custom prompt
        const client = new (require('openai'))({
            baseURL: 'https://api.groq.com/openai/v1',
            apiKey: process.env.GROQ_API_KEY
        });

        const completion = await client.chat.completions.create({
            model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: 'You are an expert business analyst and product strategist.' },
                { role: 'user', content: prompt }
            ],
            max_tokens: parseInt(process.env.GROQ_MAX_TOKENS) || 2000,
            temperature: parseFloat(process.env.GROQ_TEMPERATURE) || 0.7
        });

        res.json({
            success: true,
            result: completion.choices[0].message.content,
            usage: completion.usage
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// Get user ideas via API
exports.getIdeas = asyncHandler(async (req, res) => {
    const userId = req.session.user.id;
    const { status, search, limit = 10, offset = 0 } = req.query;

    const result = await ideaService.getUserIdeas(userId, {
        status,
        search,
        limit: Math.min(parseInt(limit), 50),
        offset: parseInt(offset)
    });

    res.json({
        success: true,
        data: result
    });
});

// Get single idea via API
exports.getIdea = asyncHandler(async (req, res) => {
    const ideaId = req.params.id;
    const userId = req.session.user.id;

    const idea = await ideaService.getIdeaById(ideaId, userId);

    if (!idea) {
        return res.status(404).json({
            success: false,
            message: 'Idea not found'
        });
    }

    res.json({
        success: true,
        data: idea
    });
});

// Create idea via API
exports.createIdea = asyncHandler(async (req, res) => {
    const { title, raw_idea } = req.body;
    const userId = req.session.user.id;

    if (!title || !raw_idea) {
        return res.status(400).json({
            success: false,
            message: 'Title and idea are required'
        });
    }

    const idea = await ideaService.createIdea(userId, title, raw_idea);

    res.status(201).json({
        success: true,
        message: 'Idea created successfully',
        data: idea
    });
});

// Update idea via API
exports.updateIdea = asyncHandler(async (req, res) => {
    const ideaId = req.params.id;
    const userId = req.session.user.id;
    const updates = req.body;

    const idea = await ideaService.updateIdea(ideaId, userId, updates);

    res.json({
        success: true,
        message: 'Idea updated successfully',
        data: idea
    });
});

// Delete idea via API
exports.deleteIdea = asyncHandler(async (req, res) => {
    const ideaId = req.params.id;
    const userId = req.session.user.id;

    await ideaService.deleteIdea(ideaId, userId);

    res.json({
        success: true,
        message: 'Idea deleted successfully'
    });
});

// Get user statistics
exports.getStats = asyncHandler(async (req, res) => {
    const userId = req.session.user.id;
    const stats = await ideaService.getUserStats(userId);

    res.json({
        success: true,
        data: stats
    });
});

// Test Groq connection
exports.testConnection = asyncHandler(async (req, res) => {
    const result = await groqService.testConnection();

    if (result.success) {
        res.json({
            success: true,
            message: result.message
        });
    } else {
        res.status(500).json({
            success: false,
            message: result.message
        });
    }
});
