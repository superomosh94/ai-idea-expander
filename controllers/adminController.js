const { User, Idea } = require('../models');
const { asyncHandler } = require('../middleware/errorMiddleware');
const db = require('../config/database');

/**
 * Admin Controller
 * Handles admin dashboard and management functionality
 */

// Show admin dashboard
exports.showDashboard = asyncHandler(async (req, res) => {
    // Get statistics
    const [totalUsersResult] = await db.query('SELECT COUNT(*) as count FROM users');
    const [totalIdeasResult] = await db.query('SELECT COUNT(*) as count FROM ideas');
    const [activeUsersResult] = await db.query(
        'SELECT COUNT(DISTINCT user_id) as count FROM ideas WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)'
    );
    const [newUsersThisMonthResult] = await db.query(
        'SELECT COUNT(*) as count FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)'
    );
    const [ideasTodayResult] = await db.query(
        'SELECT COUNT(*) as count FROM ideas WHERE DATE(created_at) = CURDATE()'
    );
    const [apiCallsResult] = await db.query(
        'SELECT COUNT(*) as count FROM api_usage WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)'
    );

    const stats = {
        totalUsers: totalUsersResult[0].count,
        totalIdeas: totalIdeasResult[0].count,
        activeUsers: activeUsersResult[0].count,
        newUsersThisMonth: newUsersThisMonthResult[0].count,
        ideasToday: ideasTodayResult[0].count,
        apiCalls: apiCallsResult[0].count || 0
    };

    // Get recent users
    const [recentUsers] = await db.query(
        `SELECT id, name, email, role, is_active, created_at 
         FROM users 
         ORDER BY created_at DESC 
         LIMIT 5`
    );

    // Get recent ideas with user names
    const [recentIdeas] = await db.query(
        `SELECT i.id, i.title, i.status, i.created_at, u.name as user_name
         FROM ideas i
         JOIN users u ON i.user_id = u.id
         ORDER BY i.created_at DESC
         LIMIT 5`
    );

    res.render('admin/dashboard', {
        title: 'Admin Dashboard',
        stats,
        recentUsers,
        recentIdeas
    });
});

// Show all users
exports.showUsers = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;

    // Get total count
    const [countResult] = await db.query('SELECT COUNT(*) as count FROM users');
    const totalUsers = countResult[0].count;
    const totalPages = Math.ceil(totalUsers / limit);

    // Get users with idea count
    const users = await db.query(
        `SELECT u.*, 
                COUNT(i.id) as idea_count
         FROM users u
         LEFT JOIN ideas i ON u.id = i.user_id
         GROUP BY u.id
         ORDER BY u.created_at DESC
         LIMIT :limit OFFSET :offset`,
        {
            replacements: { limit, offset },
            type: db.QueryTypes.SELECT
        }
    );

    res.render('admin/users', {
        title: 'Manage Users',
        users,
        currentPage: page,
        totalPages,
        csrfToken: req.csrfToken()
    });
});

// Toggle user status
exports.toggleUserStatus = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) {
        req.flash('error', 'User not found');
        return res.redirect('/admin/users');
    }

    // Prevent disabling own account
    if (user.id === req.session.user.id) {
        req.flash('error', 'You cannot disable your own account');
        return res.redirect('/admin/users');
    }

    user.is_active = !user.is_active;
    await user.save();

    req.flash('success', `User ${user.is_active ? 'activated' : 'deactivated'} successfully`);
    res.redirect('/admin/users');
});

// Delete user
exports.deleteUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) {
        req.flash('error', 'User not found');
        return res.redirect('/admin/users');
    }

    // Prevent deleting own account
    if (user.id === req.session.user.id) {
        req.flash('error', 'You cannot delete your own account');
        return res.redirect('/admin/users');
    }

    await user.destroy();

    req.flash('success', 'User deleted successfully');
    res.redirect('/admin/users');
});

// Show all ideas
exports.showIdeas = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;

    // Get total count
    const [countResult] = await db.query('SELECT COUNT(*) as count FROM ideas');
    const totalIdeas = countResult[0].count;
    const totalPages = Math.ceil(totalIdeas / limit);

    // Get ideas with user info
    const ideas = await db.query(
        `SELECT i.*, u.name as user_name, u.email as user_email
         FROM ideas i
         JOIN users u ON i.user_id = u.id
         ORDER BY i.created_at DESC
         LIMIT :limit OFFSET :offset`,
        {
            replacements: { limit, offset },
            type: db.QueryTypes.SELECT
        }
    );

    res.render('admin/ideas', {
        title: 'Manage Ideas',
        ideas,
        currentPage: page,
        totalPages,
        csrfToken: req.csrfToken()
    });
});

// Delete idea
exports.deleteIdea = asyncHandler(async (req, res) => {
    const { ideaId } = req.params;

    const idea = await Idea.findByPk(ideaId);
    if (!idea) {
        req.flash('error', 'Idea not found');
        return res.redirect('/admin/ideas');
    }

    await idea.destroy();

    req.flash('success', 'Idea deleted successfully');
    res.redirect('/admin/ideas');
});

// Show system statistics
exports.showStatistics = asyncHandler(async (req, res) => {
    // Get comprehensive statistics
    const [userStats] = await db.query(`
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admins,
            SUM(CASE WHEN role = 'user' THEN 1 ELSE 0 END) as regular_users,
            SUM(CASE WHEN is_active = true THEN 1 ELSE 0 END) as active,
            SUM(CASE WHEN is_active = false THEN 1 ELSE 0 END) as inactive
        FROM users
    `);

    const [ideaStats] = await db.query(`
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
            SUM(CASE WHEN status = 'processing' THEN 1 ELSE 0 END) as processing,
            SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
            SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed
        FROM ideas
    `);

    const [apiStats] = await db.query(`
        SELECT 
            COUNT(*) as total_calls,
            SUM(tokens_used) as total_tokens,
            AVG(response_time) as avg_response_time,
            SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as successful,
            SUM(CASE WHEN status = 'error' THEN 1 ELSE 0 END) as failed
        FROM api_usage
    `);

    res.render('admin/statistics', {
        title: 'System Statistics',
        userStats: userStats[0],
        ideaStats: ideaStats[0],
        apiStats: apiStats[0] || { total_calls: 0, total_tokens: 0, avg_response_time: 0, successful: 0, failed: 0 }
    });
});

module.exports = exports;
