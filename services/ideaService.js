const { Idea, IdeaSection } = require('../models');
const groqService = require('./groqService');
const { SECTION_TYPES } = require('../config/constants');

/**
 * Idea Service
 * Business logic for idea operations
 */

class IdeaService {
    /**
     * Create a new idea
     */
    async createIdea(userId, title, rawIdea) {
        const idea = await Idea.create({
            user_id: userId,
            title,
            raw_idea: rawIdea,
            status: 'draft'
        });

        return idea;
    }

    /**
     * Expand an idea using AI
     */
    async expandIdea(ideaId, userId) {
        const idea = await Idea.findOne({
            where: { id: ideaId, user_id: userId }
        });

        if (!idea) {
            throw new Error('Idea not found');
        }

        // Call Groq API
        const result = await groqService.expandIdea(idea.raw_idea);

        // Generate follow-up prompts
        const suggestedPrompts = groqService.generateFollowUpPrompts(idea.raw_idea, result.parsedSections);

        // Update idea with expanded content
        idea.expanded_content = result.expandedContent;
        idea.sections_parsed = result.parsedSections;
        idea.suggested_prompts = suggestedPrompts; // Store suggested prompts
        idea.status = 'expanded';
        await idea.save();

        // Create IdeaSection records
        await this.createSections(idea.id, result.parsedSections);

        return idea;
    }

    /**
     * Create idea sections from parsed content
     */
    async createSections(ideaId, parsedSections) {
        const sectionTypes = Object.keys(SECTION_TYPES);
        const sections = [];

        let orderIndex = 0;
        for (const type of sectionTypes) {
            const sectionType = SECTION_TYPES[type];
            const content = parsedSections[sectionType];

            if (content && content.trim()) {
                sections.push({
                    idea_id: ideaId,
                    section_type: sectionType,
                    content: content,
                    order_index: orderIndex++
                });
            }
        }

        if (sections.length > 0) {
            await IdeaSection.bulkCreate(sections);
        }

        return sections;
    }

    /**
     * Get all ideas for a user
     */
    async getUserIdeas(userId, options = {}) {
        const { status, search, limit = 10, offset = 0, orderBy = 'created_at', orderDir = 'DESC' } = options;

        const where = { user_id: userId };

        if (status) {
            where.status = status;
        }

        if (search) {
            const { Op } = require('sequelize');
            where[Op.or] = [
                { title: { [Op.like]: `%${search}%` } },
                { raw_idea: { [Op.like]: `%${search}%` } }
            ];
        }

        const ideas = await Idea.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [[orderBy, orderDir]],
            include: [{
                model: IdeaSection,
                as: 'sections',
                required: false
            }]
        });

        return {
            ideas: ideas.rows,
            total: ideas.count,
            limit: parseInt(limit),
            offset: parseInt(offset)
        };
    }

    /**
     * Get a single idea with details
     */
    async getIdeaById(ideaId, userId) {
        const idea = await Idea.findOne({
            where: { id: ideaId, user_id: userId },
            include: [{
                model: IdeaSection,
                as: 'sections',
                order: [['order_index', 'ASC']]
            }]
        });

        return idea;
    }

    /**
     * Update an idea
     */
    async updateIdea(ideaId, userId, updates) {
        const idea = await Idea.findOne({
            where: { id: ideaId, user_id: userId }
        });

        if (!idea) {
            throw new Error('Idea not found');
        }

        Object.assign(idea, updates);
        await idea.save();

        return idea;
    }

    /**
     * Delete an idea
     */
    async deleteIdea(ideaId, userId) {
        const idea = await Idea.findOne({
            where: { id: ideaId, user_id: userId }
        });

        if (!idea) {
            throw new Error('Idea not found');
        }

        await idea.destroy();
        return true;
    }

    /**
     * Toggle favorite status
     */
    async toggleFavorite(ideaId, userId) {
        const idea = await Idea.findOne({
            where: { id: ideaId, user_id: userId }
        });

        if (!idea) {
            throw new Error('Idea not found');
        }

        idea.is_favorite = !idea.is_favorite;
        await idea.save();

        return idea;
    }

    /**
     * Get statistics for user's ideas
     */
    async getUserStats(userId) {
        const { Op } = require('sequelize');

        const total = await Idea.count({ where: { user_id: userId } });
        const expanded = await Idea.count({ where: { user_id: userId, status: 'expanded' } });
        const drafts = await Idea.count({ where: { user_id: userId, status: 'draft' } });
        const favorites = await Idea.count({ where: { user_id: userId, is_favorite: true } });

        return {
            total,
            expanded,
            drafts,
            favorites
        };
    }
}

module.exports = new IdeaService();
