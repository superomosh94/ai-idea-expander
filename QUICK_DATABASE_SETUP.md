# Quick Database Setup Guide

## 🎯 You Need to Create the Database

Your MySQL server is running, but the database `ai_idea_expander` doesn't exist yet. Here's how to create it:

---

## Option 1: Using MySQL Workbench (Easiest - Visual Interface)

### Step 1: Open MySQL Workbench
- Launch MySQL Workbench from Start Menu

### Step 2: Connect to MySQL
- Click on your local MySQL connection
- Enter your root password when prompted

### Step 3: Run the Setup Script
1. Click **File** → **Open SQL Script**
2. Navigate to: `C:\Users\SENIOR\Documents\mato\ai-idea-expander\scripts\setup-database.sql`
3. Click **Open**
4. Click the **⚡ Execute** button (lightning bolt icon)
5. You should see "Database setup completed successfully!"

### Step 4: Verify
You should see these tables created:
- `users`
- `ideas`
- `expanded_ideas`
- `api_usage`

---

## Option 2: Using MySQL Command Line

### Step 1: Open MySQL Command Line Client
- Start Menu → MySQL → MySQL 8.0 Command Line Client
- Enter your root password

### Step 2: Run the Script
```bash
source C:/Users/SENIOR/Documents/mato/ai-idea-expander/scripts/setup-database.sql
```

OR copy and paste the contents of `setup-database.sql` directly

### Step 3: Verify
Type:
```sql
SHOW DATABASES;
USE ai_idea_expander;
SHOW TABLES;
```

You should see the `ai_idea_expander` database with 4 tables.

---

## Option 3: Using PowerShell Command

Open PowerShell in this directory and run:

```powershell
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p < scripts\setup-database.sql
```

Enter your root password when prompted.

---

## After Creating the Database

### Update Your .env File

Your `.env` file should have these settings:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ai_idea_expander
DB_USER=root
DB_PASSWORD=your_actual_mysql_password
```

**Important:** Replace `your_actual_mysql_password` with your real MySQL root password!

### Restart the Server

The server should already restart automatically if you're using `--watch`, or manually:
```bash
npm start
```

You should see:
```
✅ Database connection established successfully.
✅ Database models synchronized.
🚀 Server running on http://localhost:3000
```

---

## 📊 Database Schema Overview

The script creates 4 tables:

### 1. **users** - User accounts
- id, name, email, password, role, etc.

### 2. **ideas** - Original user ideas
- id, user_id, title, original_idea, category, status

### 3. **expanded_ideas** - AI-expanded versions
- id, idea_id, expanded_content, expansion_type, model_used, tokens_used

### 4. **api_usage** - API usage tracking
- id, user_id, idea_id, tokens_used, cost_estimate, response_time

---

## 🔐 Optional: Create Dedicated User (More Secure)

Instead of using root, you can create a dedicated user:

1. **Open the SQL script**: `scripts/setup-database.sql`

2. **Uncomment these lines** (remove the `--` at the start):
   ```sql
   CREATE USER IF NOT EXISTS 'ai_expander'@'localhost' IDENTIFIED BY 'SecurePassword123!';
   GRANT ALL PRIVILEGES ON ai_idea_expander.* TO 'ai_expander'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. **Run the script again**

4. **Update your .env**:
   ```env
   DB_USER=ai_expander
   DB_PASSWORD=SecurePassword123!
   ```

---

## ❓ Troubleshooting

### "Access Denied" Error
- Make sure your MySQL root password is correct in the `.env` file
- No extra spaces or quotes around the password

### Can't Find MySQL
- MySQL is installed at: `C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe`
- You can add it to your PATH or use the full path

### "Database already exists"
- That's fine! The script uses `IF NOT EXISTS` so it's safe to run multiple times

---

## 🎉 Next Steps

Once the database is created and server starts successfully:

1. Visit: http://localhost:3000
2. Register a new user account
3. Start expanding your ideas!
