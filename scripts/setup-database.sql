-- =============================================================================
-- AI Idea Expander - Complete Database Setup Script
-- =============================================================================
-- This script will:
-- 1. Create the database
-- 2. Create a dedicated user (optional but recommended)
-- 3. Create all required tables with proper relationships
--
-- Run this as MySQL root user:
-- mysql -u root -p < setup-database.sql
--
-- Or copy and paste into MySQL Workbench or MySQL Command Line Client
-- =============================================================================

-- Step 1: Create the database
-- =============================================================================
CREATE DATABASE IF NOT EXISTS ai_idea_expander 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Select the database
USE ai_idea_expander;

-- Step 2: Create dedicated user (OPTIONAL - for better security)
-- =============================================================================
-- Uncomment the following lines if you want a dedicated user instead of using root
-- CREATE USER IF NOT EXISTS 'ai_expander'@'localhost' IDENTIFIED BY 'SecurePassword123!';
-- GRANT ALL PRIVILEGES ON ai_idea_expander.* TO 'ai_expander'@'localhost';
-- FLUSH PRIVILEGES;

-- Step 3: Create all tables
-- =============================================================================

-- Table: users
-- Stores user accounts (email/password authentication)
-- =============================================================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: ideas
-- Stores user's original ideas before expansion
-- =============================================================================
CREATE TABLE IF NOT EXISTS ideas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(500) NOT NULL,
    original_idea TEXT NOT NULL,
    category VARCHAR(100),
    status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: expanded_ideas
-- Stores AI-generated expanded versions of ideas
-- =============================================================================
CREATE TABLE IF NOT EXISTS expanded_ideas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idea_id INT NOT NULL,
    expanded_content TEXT NOT NULL,
    expansion_type ENUM('detailed', 'creative', 'technical', 'business') DEFAULT 'detailed',
    model_used VARCHAR(100),
    tokens_used INT,
    processing_time INT COMMENT 'in milliseconds',
    rating INT CHECK (rating >= 1 AND rating <= 5),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE,
    INDEX idx_idea_id (idea_id),
    INDEX idx_expansion_type (expansion_type),
    INDEX idx_created_at (created_at),
    INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: api_usage
-- Tracks DeepSeek API usage for monitoring and billing
-- =============================================================================
CREATE TABLE IF NOT EXISTS api_usage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    idea_id INT,
    endpoint VARCHAR(255),
    model VARCHAR(100),
    tokens_used INT,
    cost_estimate DECIMAL(10, 6),
    response_time INT COMMENT 'in milliseconds',
    status ENUM('success', 'error') DEFAULT 'success',
    error_message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- Insert sample admin user (OPTIONAL - for testing)
-- =============================================================================
-- Password: admin123 (hashed with bcrypt, 10 rounds)
-- Uncomment to create a default admin account
-- INSERT INTO users (name, email, password, role, email_verified) VALUES 
-- ('Admin User', 'admin@example.com', '$2b$10$rBV2kGJZQvfqWZfV0a3s1uXRlP3J3VN1Fl5NNvW7dN2HKqOp9yGOm', 'admin', true);

-- =============================================================================
-- Verify Tables Created
-- =============================================================================
SHOW TABLES;

-- Show table structures
DESCRIBE users;
DESCRIBE ideas;
DESCRIBE expanded_ideas;
DESCRIBE api_usage;

-- Show table relationships
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM
    INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE
    REFERENCED_TABLE_SCHEMA = 'ai_idea_expander'
    AND REFERENCED_TABLE_NAME IS NOT NULL;

-- =============================================================================
-- Setup Complete!
-- =============================================================================
SELECT 'Database setup completed successfully!' AS Status;
