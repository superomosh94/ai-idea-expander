// Script to check users in the database
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const User = require('../models/User');
const sequelize = require('../config/database');

async function checkUsers() {
    try {
        // Connect to database
        await sequelize.authenticate();
        console.log('✅ Connected to database\n');

        // Get all users
        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'role', 'is_active', 'last_login', 'created_at']
        });

        console.log('='.repeat(80));
        console.log('USER DATABASE REPORT');
        console.log('='.repeat(80));
        console.log(`\nTotal Users: ${users.length}\n`);

        if (users.length === 0) {
            console.log('❌ No users found in database');
        } else {
            users.forEach((user, index) => {
                console.log(`\n--- USER ${index + 1} ---`);
                console.log(`ID:           ${user.id}`);
                console.log(`Name:         ${user.name}`);
                console.log(`Email:        ${user.email}`);
                console.log(`Role:         ${user.role}`);
                console.log(`Active:       ${user.is_active ? 'Yes' : 'No'}`);
                console.log(`Last Login:   ${user.last_login || 'Never'}`);
                console.log(`Created:      ${user.created_at}`);
            });
        }

        console.log('\n' + '='.repeat(80));

        // Note about passwords
        console.log('\n📝 NOTE: Passwords are stored as bcrypt hashes for security.');
        console.log('   They cannot be retrieved in plain text.');
        console.log('   Use the password reset feature to change a user password.\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkUsers();
