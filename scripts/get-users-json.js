// Simple script to output user data as JSON
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const User = require('../models/User');
const sequelize = require('../config/database');

async function getUsers() {
    try {
        await sequelize.authenticate();

        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'role', 'is_active', 'last_login', 'created_at'],
            raw: true
        });

        console.log(JSON.stringify(users, null, 2));
        process.exit(0);
    } catch (error) {
        console.error(JSON.stringify({ error: error.message }));
        process.exit(1);
    }
}

getUsers();
