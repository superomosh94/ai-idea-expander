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
        this.model = GROQ.MODEL || process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
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
     * Generate follow-up prompts for deeper exploration
     */
    generateFollowUpPrompts(ideaText, parsedSections) {
        const prompts = [];

        // Technical Deep Dive
        if (parsedSections.features) {
            prompts.push({
                category: 'Technical',
                title: 'Technical Architecture & Stack',
                description: 'Explore the technical implementation, architecture patterns, and recommended technology stack.',
                prompt: `Based on the idea: "${ideaText}"\n\nProvide a detailed technical architecture analysis including:\n- Recommended technology stack\n- System architecture diagram description\n- Database schema considerations\n- API design approach\n- Scalability considerations\n- Security best practices`,
                icon: 'bi-cpu-fill',
                color: 'info'
            });
        }

        // Market Research
        if (parsedSections.users) {
            prompts.push({
                category: 'Market',
                title: 'Competitive Analysis & Market Research',
                description: 'Analyze competitors, market size, and positioning strategy.',
                prompt: `For the idea: "${ideaText}"\n\nConduct a comprehensive market analysis:\n- Identify top 5 competitors and their strengths/weaknesses\n- Estimate total addressable market (TAM)\n- Define unique value proposition\n- Suggest pricing strategy\n- Analyze market trends and opportunities`,
                icon: 'bi-graph-up-arrow',
                color: 'success'
            });
        }

        // Go-to-Market Strategy
        prompts.push({
            category: 'Strategy',
            title: 'Go-to-Market & Launch Plan',
            description: 'Create a detailed launch strategy and marketing plan.',
            prompt: `For the idea: "${ideaText}"\n\nDevelop a go-to-market strategy:\n- Pre-launch checklist\n- Marketing channels and tactics\n- User acquisition strategy\n- Launch timeline (3-6 months)\n- Budget allocation recommendations\n- Growth hacking techniques`,
            icon: 'bi-rocket-takeoff-fill',
            color: 'warning'
        });

        // Monetization Strategy
        prompts.push({
            category: 'Revenue',
            title: 'Monetization & Revenue Models',
            description: 'Explore different revenue streams and pricing strategies.',
            prompt: `For the idea: "${ideaText}"\n\nAnalyze monetization opportunities:\n- Multiple revenue stream options\n- Pricing models (freemium, subscription, etc.)\n- Lifetime value (LTV) projections\n- Unit economics\n- Revenue milestones for next 12 months`,
            icon: 'bi-cash-stack',
            color: 'success'
        });

        // UX/UI Design
        if (parsedSections.workflow) {
            prompts.push({
                category: 'Design',
                title: 'UX/UI Design & User Experience',
                description: 'Create detailed wireframes and user experience flow.',
                prompt: `For the idea: "${ideaText}"\n\nDesign the user experience:\n- Key user flows and wireframe descriptions\n- Information architecture\n- Design system recommendations\n- Accessibility considerations\n- Mobile vs desktop priorities\n- Onboarding experience`,
                icon: 'bi-palette-fill',
                color: 'primary'
            });
        }

        // Legal & Compliance
        prompts.push({
            category: 'Legal',
            title: 'Legal, Compliance & Privacy',
            description: 'Address legal requirements, data privacy, and compliance needs.',
            prompt: `For the idea: "${ideaText}"\n\nIdentify legal and compliance requirements:\n- Data privacy regulations (GDPR, CCPA)\n- Terms of service essentials\n- Intellectual property protection\n- Required licenses or permits\n- Insurance needs\n- Liability considerations`,
            icon: 'bi-shield-check',
            color: 'danger'
        });

        return prompts;
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


    /**
     * Generate a random business idea
     */
    /**
     * Generate a list of business ideas based on context
     */
    async generateIdeasFromContext(context, count = 3) {
        try {
            if (!this.apiKey) {
                throw new Error('Groq API key is not configured');
            }

            const prompt = `Generate ${count} unique and innovative startup business ideas based on the following context/field: "${context}".
            
            Return ONLY a valid JSON array of objects with the following structure, and NO other text:
            [
                {
                    "title": "Catchy name",
                    "description": "2-3 sentences describing value proposition"
                }
            ]`;

            const completion = await this.client.chat.completions.create({
                model: this.model,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a creative startup incubator assistant. You generate innovative business ideas based on specific contexts. You must output strictly valid JSON array.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 1000,
                temperature: 0.8,
                response_format: { type: "json_object" }
            });

            const content = completion.choices[0].message.content;
            const parsed = JSON.parse(content);
            // Handle if the API returns an object with a key 'ideas' or just the array
            return Array.isArray(parsed) ? parsed : (parsed.ideas || [parsed]);
        } catch (error) {
            console.error('Error generating ideas from context:', error);
            // Fallback ideas if AI fails
            return [
                {
                    title: 'Contextual AI Assistant',
                    description: 'An AI assistant that adapts to your specific field context, providing tailored suggestions and workflows.'
                },
                {
                    title: 'Smart Project Manager',
                    description: 'A project management tool that uses AI to predict bottlenecks and suggest resource allocation based on team velocity.'
                }
            ];
        }
    }
}

module.exports = new GroqService();
