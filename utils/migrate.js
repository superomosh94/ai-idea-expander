require('dotenv').config();
const sequelize = require('../config/database');
const { User, Idea, IdeaSection } = require('../models');

/**
 * Database Migration Script
 * Run this to create all database tables
 */

async function migrate() {
    try {
        console.log('🔄 Starting database migration...');

        // Test connection
        await sequelize.authenticate();
        console.log('✅ Database connection established.');

        // Sync all models
        await sequelize.sync({ force: false, alter: true });
        console.log('✅ All models synchronized successfully.');

        console.log('\n📋 Migration Summary:');
        console.log('   - Users table created/updated');
        console.log('   - Ideas table created/updated');
        console.log('   - IdeaSections table created/updated');
        console.log('\n✨ Migration completed successfully!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

// Run migration
migrate();
