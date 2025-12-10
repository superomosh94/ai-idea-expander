require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

async function setupDatabase() {
    let connection;

    try {
        // First connect without specifying a database to create it
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD,
            multipleStatements: true
        });

        console.log('✅ Connected to MySQL server');

        // Read the SQL file
        const sqlFile = path.join(__dirname, 'setup-database.sql');
        const sql = await fs.readFile(sqlFile, 'utf8');

        // Execute the SQL script
        console.log('📝 Executing database setup script...');
        await connection.query(sql);

        console.log('✅ Database setup completed successfully!');
        console.log('');
        console.log('Created database: ai_idea_expander');
        console.log('Created tables: users, ideas, expanded_ideas, api_usage');
        console.log('');
        console.log('You can now start your server with: npm start');

    } catch (error) {
        console.error('❌ Error setting up database:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

setupDatabase();
