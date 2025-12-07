# 🚀 Quick Setup Guide

## Prerequisites Check

Before starting, verify you have:
- ✅ Node.js v16+ (`node --version`)
- ✅ MySQL 8.0+ (`mysql --version`)
- ✅ npm v8+ (`npm --version`)

## Step-by-Step Installation

### 1️⃣ Navigate to Project Directory
```bash
cd ai-idea-expander
```

### 2️⃣ Install Dependencies
```bash
npm install
```

This will install all required packages including:
- express, ejs, sequelize, mysql2
- bcrypt, express-session, csrf
- axios (for DeepSeek API)
- And more...

### 3️⃣ Setup MySQL Database

Open MySQL terminal:
```bash
mysql -u root -p
```

Run these commands:
```sql
CREATE DATABASE ai_idea_expander;
EXIT;
```

### 4️⃣ Configure Environment

Copy the example file:
```bash
cp .env.example .env
```

**IMPORTANT**: Edit `.env` file with your settings:

```env
# 1. Database Password
DB_PASSWORD=your_actual_mysql_password

# 2. Session Secret (generate a random string)
SESSION_SECRET=change_this_to_random_string_min_32_chars

# 3. DeepSeek API Key (get from https://platform.deepseek.com)
DEEPSEEK_API_KEY=sk-your-actual-api-key-here
```

### 5️⃣ Get DeepSeek API Key (FREE)

1. Visit: https://platform.deepseek.com/
2. Sign up for free account
3. Go to "API Keys" section
4. Click "Create API Key"
5. Copy the key
6. Paste in `.env` file as `DEEPSEEK_API_KEY`

### 6️⃣ Initialize Database

Run migration to create tables:
```bash
npm run migrate
```

Expected output:
```
🔄 Starting database migration...
✅ Database connection established.
✅ All models synchronized successfully.
✨ Migration completed successfully!
```

### 7️⃣ (Optional) Add Sample Data

```bash
npm run seed
```

This creates:
- Demo user: demo@example.com / Demo@123
- 3 sample ideas

### 8️⃣ Start the Application

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

### 9️⃣ Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## 🎉 You're Ready!

### First Steps:
1. Click "Get Started" or "Register"
2. Create your account
3. Click "Create New Idea"
4. Enter an idea and expand it with AI!

## 🔧 Troubleshooting

### Issue: Cannot connect to database
**Solution**: 
- Check MySQL is running: `sudo service mysql status`
- Verify DB_PASSWORD in `.env`
- Ensure database exists: `mysql -u root -p -e "SHOW DATABASES;"`

### Issue: DeepSeek API error
**Solution**:
- Verify DEEPSEEK_API_KEY is correct
- Check your API quota at platform.deepseek.com
- Ensure you have internet connection

### Issue: Port 3000 already in use
**Solution**:
Change PORT in `.env`:
```env
PORT=3001
```

Or kill the process:
```bash
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## 📚 Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Explore the codebase structure
- Test all features
- Customize to your needs

## 🆘 Need Help?

1. Check the troubleshooting section
2. Review error messages carefully
3. Verify all environment variables
4. Ensure all dependencies are installed

## 🎯 Quick Test

After setup, try this:
1. Register a new account
2. Create an idea: "A mobile app for tracking daily habits"
3. Expand it with AI
4. View the comprehensive analysis!

---

Happy coding! 🚀
