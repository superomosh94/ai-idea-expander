#!/usr/bin/env node

/**
 * Interactive Setup Script for AI Idea Expander
 * Run this to configure your application
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function setup() {
    console.log('\n🚀 AI Idea Expander - Interactive Setup\n');
    console.log('This script will help you configure your application.\n');

    // Read .env.example
    const envExamplePath = path.join(__dirname, '..', '.env.example');
    const envPath = path.join(__dirname, '..', '.env');

    let envContent = fs.readFileSync(envExamplePath, 'utf8');

    // Database Configuration
    console.log('📊 Database Configuration:');
    const dbHost = await question('MySQL Host (default: localhost): ') || 'localhost';
    const dbPort = await question('MySQL Port (default: 3306): ') || '3306';
    const dbName = await question('Database Name (default: ai_idea_expander): ') || 'ai_idea_expander';
    const dbUser = await question('MySQL User (default: root): ') || 'root';
    const dbPassword = await question('MySQL Password: ');

    // Session Secret
    console.log('\n🔐 Security Configuration:');
    console.log('Generating secure session secret...');
    const sessionSecret = generateRandomString(64);
    const csrfSecret = generateRandomString(32);

    // Groq API
    console.log('\n🤖 Groq API Configuration:');
    console.log('Get your API key from: https://console.groq.com/keys');
    const groqKey = await question('Groq API Key: ');

    // Update env content
    envContent = envContent.replace('DB_HOST=localhost', `DB_HOST=${dbHost}`);
    envContent = envContent.replace('DB_PORT=3306', `DB_PORT=${dbPort}`);
    envContent = envContent.replace('DB_NAME=ai_idea_expander', `DB_NAME=${dbName}`);
    envContent = envContent.replace('DB_USER=root', `DB_USER=${dbUser}`);
    envContent = envContent.replace('DB_PASSWORD=your_mysql_password', `DB_PASSWORD=${dbPassword}`);
    envContent = envContent.replace('SESSION_SECRET=your-super-secret-session-key-change-this-in-production', `SESSION_SECRET=${sessionSecret}`);
    envContent = envContent.replace('CSRF_SECRET=your-csrf-secret-key', `CSRF_SECRET=${csrfSecret}`);
    envContent = envContent.replace('GROQ_API_KEY=your-groq-api-key-here', `GROQ_API_KEY=${groqKey}`);

    // Write .env file
    fs.writeFileSync(envPath, envContent);

    console.log('\n✅ Configuration saved to .env file!');
    console.log('\n📋 Next Steps:');
    console.log('   1. npm install');
    console.log('   2. npm run migrate');
    console.log('   3. npm run seed (optional)');
    console.log('   4. npm run dev');
    console.log('\n🎉 Setup complete!\n');

    rl.close();
}

function generateRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Run setup
setup().catch(error => {
    console.error('Setup failed:', error);
    rl.close();
});
