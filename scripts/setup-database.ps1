#!/usr/bin/env pwsh
# Setup database for AI Idea Expander
Write-Host "Setting up database for AI Idea Expander..." -ForegroundColor Cyan
Write-Host ""

$MYSQL_BIN = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"

# Prompt for MySQL root password securely
$SecurePassword = Read-Host "Enter your MySQL root password" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecurePassword)
$MYSQL_ROOT_PASS = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

Write-Host ""
Write-Host "Creating database and user..." -ForegroundColor Yellow
Write-Host ""

# Create database
& $MYSQL_BIN -u root "-p$MYSQL_ROOT_PASS" -e "CREATE DATABASE IF NOT EXISTS ai_idea_expander CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Create user
& $MYSQL_BIN -u root "-p$MYSQL_ROOT_PASS" -e "CREATE USER IF NOT EXISTS 'ai_expander'@'localhost' IDENTIFIED BY 'SecurePassword123!';"

# Grant privileges
& $MYSQL_BIN -u root "-p$MYSQL_ROOT_PASS" -e "GRANT ALL PRIVILEGES ON ai_idea_expander.* TO 'ai_expander'@'localhost';"

# Flush privileges
& $MYSQL_BIN -u root "-p$MYSQL_ROOT_PASS" -e "FLUSH PRIVILEGES;"

Write-Host ""
Write-Host "✅ Database setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Update your .env file with:" -ForegroundColor Cyan
Write-Host "DB_USER=ai_expander" -ForegroundColor White
Write-Host "DB_PASSWORD=SecurePassword123!" -ForegroundColor White
Write-Host "DB_NAME=ai_idea_expander" -ForegroundColor White
Write-Host ""
