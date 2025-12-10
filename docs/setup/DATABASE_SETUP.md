# Database Setup Guide - AI Idea Expander

## Problem
Your application cannot connect to MySQL because of incorrect credentials.

Error: `Access denied for user 'root'@'localhost' (using password: YES)`

## Solutions

### Option 1: Use Existing MySQL Root Password (Quick Fix)

1. **Find your MySQL root password** - This was set when you installed MySQL
2. **Edit your `.env` file** located at: `c:\Users\SENIOR\Documents\mato\ai-idea-expander\.env`
3. **Update the line:**
   ```
   DB_PASSWORD=your_actual_mysql_root_password
   ```
4. **Restart the server**

### Option 2: Create a Dedicated Database User (Recommended)

#### Step 1: Run the setup script
Open PowerShell in this directory and run:
```powershell
.\scripts\setup-database.ps1
```
This script will:
- Ask for your MySQL root password
- Create the database `ai_idea_expander`
- Create a new user `ai_expander` with password `SecurePassword123!`
- Grant appropriate permissions

#### Step 2: Update your .env file
Edit `.env` and change these lines:
```env
DB_USER=ai_expander
DB_PASSWORD=SecurePassword123!
DB_NAME=ai_idea_expander
```

#### Step 3: Restart the server
```bash
npm start
```

### Option 3: Manual Setup via MySQL Command Line

If you prefer to set things up manually:

1. **Open MySQL Command Line** (Start Menu → MySQL → MySQL 8.0 Command Line Client)
2. **Enter your root password**
3. **Run these commands:**
   ```sql
   CREATE DATABASE IF NOT EXISTS ai_idea_expander CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER IF NOT EXISTS 'ai_expander'@'localhost' IDENTIFIED BY 'SecurePassword123!';
   GRANT ALL PRIVILEGES ON ai_idea_expander.* TO 'ai_expander'@'localhost';
   FLUSH PRIVILEGES;
   exit;
   ```
4. **Update your `.env` file** as shown in Option 2 Step 2
5. **Restart the server**

## Verifying Your Setup

After updating your `.env` file, test the connection:

1. Stop the current server (if running): Press `Ctrl+C`
2. Start the server again: `npm start`
3. You should see:
   ```
   ✅ Database connection established successfully.
   ✅ Database models synchronized.
   🚀 Server running on http://localhost:3000
   ```

## Common Issues

### "mysql: command not found"
MySQL is not in your PATH. Use the full path:
```
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
```

### "Access Denied" persists
- Double-check your password in the `.env` file
- Make sure there are no extra spaces or quotes
- Verify MySQL service is running: `Get-Service -Name MySQL80`

### Can't remember MySQL root password
You'll need to reset it. See MySQL documentation for password reset procedures.

## Need Help?
If you continue to have issues, please provide:
1. Your MySQL version
2. How you installed MySQL (installer, chocolatey, etc.)
3. Whether you can connect using MySQL Workbench or command line
