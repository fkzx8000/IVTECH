-- יצירת בסיס נתונים (אם לא קיים)
CREATE DATABASE IF NOT EXISTS ivthac_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE ivthac_db;

-- טבלת משתמשים
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
);

-- הוספת נתונים לדוגמה (אופציונלי)
-- INSERT INTO users (email, password, name) VALUES 
-- ('test@example.com', '$2a$12$example_hashed_password', 'Test User');