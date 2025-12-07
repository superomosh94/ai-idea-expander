require('dotenv').config();
const { User, Idea } = require('../models');

/**
 * Database Seeding Script
 * Run this to populate the database with sample data
 */

async function seed() {
    try {
        console.log('🌱 Starting database seeding...');

        // Create demo user
        const demoUser = await User.create({
            name: 'Demo User',
            email: 'demo@example.com',
            password_hash: 'Demo@123', // Will be hashed automatically
            role: 'user'
        });
        console.log('✅ Demo user created');

        // Create sample ideas
        const sampleIdeas = [
            {
                user_id: demoUser.id,
                title: 'AI-Powered Fitness Tracking App',
                raw_idea: 'A mobile app that uses AI to analyze workout videos and provide real-time form correction. It would track progress, suggest personalized workout plans, and connect users with virtual trainers.',
                status: 'draft'
            },
            {
                user_id: demoUser.id,
                title: 'Smart Grocery Shopping Assistant',
                raw_idea: 'An app that helps people plan meals, create shopping lists based on dietary preferences, and find the best deals across multiple stores. It could also track pantry inventory to reduce food waste.',
                status: 'draft'
            },
            {
                user_id: demoUser.id,
                title: 'Virtual Language Exchange Platform',
                raw_idea: 'A platform connecting language learners worldwide for video chat practice sessions. It would match users based on skill level, interests, and availability, with built-in translation tools.',
                status: 'draft'
            }
        ];

        for (const ideaData of sampleIdeas) {
            await Idea.create(ideaData);
        }
        console.log('✅ Sample ideas created');

        console.log('\n📋 Seeding Summary:');
        console.log('   - 1 demo user created');
        console.log('   - Email: demo@example.com');
        console.log('   - Password: Demo@123');
        console.log('   - 3 sample ideas created');
        console.log('\n✨ Seeding completed successfully!');
        console.log('\n💡 You can now login with the demo account to test the application.');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

// Run seeding
seed();
