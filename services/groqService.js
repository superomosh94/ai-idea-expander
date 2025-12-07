const OpenAI = require('openai');
const { GROQ } = require('../config/constants');

/**
 * Groq API Service
 * Handles all interactions with the Groq AI API
 * Using OpenAI SDK as Groq is OpenAI-compatible
 */

class GroqService {
    constructor() {
        this.apiKey = process.env.GROQ_API_KEY;
        this.model = GROQ.MODEL || process.env.GROQ_MODEL || 'llama-3.1-70b-versatile';
        this.maxTokens = GROQ.MAX_TOKENS || parseInt(process.env.GROQ_MAX_TOKENS) || 2000;
        this.temperature = GROQ.TEMPERATURE || parseFloat(process.env.GROQ_TEMPERATURE) || 0.7;

        // Initialize OpenAI client with Groq base URL
        this.client = new OpenAI({
            baseURL: 'https://api.groq.com/openai/v1',
            apiKey: this.apiKey
        });
    }

    /**
     * Generate the system prompt for idea expansion
     */
    getSystemPrompt() {
        return `You are an expert product strategist and business analyst. Your role is to help expand and analyze business ideas comprehensively.

When given an idea, you will provide a structured analysis with the following sections:

## Problem Statement
Clearly define the problem this idea solves. Identify pain points and market gaps.

## Target Users
Describe the ideal users/customers. Include demographics, behaviors, and needs.

## Core Features
List the essential features and functionalities. Prioritize MVP features.

## User Workflow
Outline how users will interact with the product/service. Describe the user journey.

## Risks & Challenges
Identify potential obstacles, technical challenges, and market risks.

## Success Metrics
Define KPIs and metrics to measure success. Include both quantitative and qualitative metrics.

Use markdown formatting with bullet points, headers, and clear structure. Be specific and actionable.`;
    }

    /**
     * Generate user prompt with the idea
     */
    getUserPrompt(idea) {
        return `Please expand and analyze the following idea in detail:

"${idea}"

Provide a comprehensive analysis using the structured format with all six sections.`;
    }

    /**
     * Call Groq API to expand an idea
     */
    async expandIdea(ideaText) {
        try {
            if (!this.apiKey) {
                throw new Error('Groq API key is not configured');
            }

            const completion = await this.client.chat.completions.create({
                model: this.model,
                messages: [
                    {
                        role: 'system',
                        content: this.getSystemPrompt()
                    },
                    {
                        role: 'user',
                        content: this.getUserPrompt(ideaText)
                    }
                ],
                max_tokens: this.maxTokens,
                temperature: this.temperature,
                stream: false
            });

            if (!completion || !completion.choices || !completion.choices[0]) {
                throw new Error('Invalid response from Groq API');
            }

            const expandedContent = completion.choices[0].message.content;
            const parsedSections = this.parseExpandedContent(expandedContent);

            return {
                success: true,
                expandedContent,
                parsedSections,
                usage: completion.usage
            };
        } catch (error) {
            console.error('Groq API Error:', error.message);

            // Handle OpenAI SDK errors
            if (error.status) {
                // API error with status code
                throw new Error(`Groq API error: ${error.message}`);
            } else {
                // Other errors
                throw new Error(`Failed to expand idea: ${error.message}`);
            }
        }
    }

    /**
     * Parse the expanded content into sections
     */
    parseExpandedContent(content) {
        const sections = {
            problem: '',
            users: '',
            features: '',
            workflow: '',
            risks: '',
            metrics: ''
        };

        try {
            // Split content by headers
            const problemMatch = content.match(/##\s*Problem Statement\s*\n([\s\S]*?)(?=##|$)/i);
            const usersMatch = content.match(/##\s*Target Users\s*\n([\s\S]*?)(?=##|$)/i);
            const featuresMatch = content.match(/##\s*Core Features\s*\n([\s\S]*?)(?=##|$)/i);
            const workflowMatch = content.match(/##\s*User Workflow\s*\n([\s\S]*?)(?=##|$)/i);
            const risksMatch = content.match(/##\s*Risks?\s*(?:&|and)?\s*Challenges?\s*\n([\s\S]*?)(?=##|$)/i);
            const metricsMatch = content.match(/##\s*Success Metrics\s*\n([\s\S]*?)(?=##|$)/i);

            if (problemMatch) sections.problem = problemMatch[1].trim();
            if (usersMatch) sections.users = usersMatch[1].trim();
            if (featuresMatch) sections.features = featuresMatch[1].trim();
            if (workflowMatch) sections.workflow = workflowMatch[1].trim();
            if (risksMatch) sections.risks = risksMatch[1].trim();
            if (metricsMatch) sections.metrics = metricsMatch[1].trim();
        } catch (error) {
            console.error('Error parsing sections:', error);
        }

        return sections;
    }

    /**
     * Test API connection
     */
    async testConnection() {
        try {
            const completion = await this.client.chat.completions.create({
                model: this.model,
                messages: [{ role: 'user', content: 'Hello' }],
                max_tokens: 10
            });

            return {
                success: true,
                message: 'Groq API connection successful'
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }
}

module.exports = new GroqService();
