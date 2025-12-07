-- Query to show all users and their information
USE ai_idea_expander;

-- Show user count
SELECT '=== TOTAL USERS ===' as info;
SELECT COUNT(*) as total_users FROM users;

-- Show all user details (with password hash preview)
SELECT 
    '=== USER DETAILS ===' as info;

SELECT 
    id,
    name,
    email,
    CONCAT(LEFT(password_hash, 10), '...') as password_hash_preview,
    role,
    is_active,
    last_login,
    created_at,
    updated_at
FROM users
ORDER BY created_at DESC;
