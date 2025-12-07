require('dotenv').config();
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

// Import database
const sequelize = require('./config/database');

// Import routes
const authRoutes = require('./routes/authRoutes');
const ideaRoutes = require('./routes/ideaRoutes');
const apiRoutes = require('./routes/apiRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Import middleware
const { errorHandler } = require('./middleware/errorMiddleware');

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdn.jsdelivr.net"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

// CORS
app.use(cors());

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    name: process.env.SESSION_NAME || 'ai_idea_session',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: parseInt(process.env.SESSION_MAX_AGE) || 86400000 // 24 hours
    }
}));

// Flash messages
app.use(flash());

// CSRF protection
const csrfProtection = csrf({ cookie: true });

// Global variables middleware
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.user = req.session.user || null;
    res.locals.isAuthenticated = !!req.session.user;
    next();
});

// Routes
app.get('/', (req, res) => {
    res.render('index', {
        title: 'AI Idea Expander',
        csrfToken: null
    });
});

app.use('/auth', csrfProtection, authRoutes);
app.use('/ideas', ideaRoutes);
app.use('/api/v1', apiRoutes);
app.use('/admin', adminRoutes);

// 404 handler
app.use((req, res, next) => {
    res.status(404).render('errors/404', {
        title: 'Page Not Found',
        csrfToken: null
    });
});

// Error handler
app.use(errorHandler);

// Database connection and server start
const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        // Test database connection
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully.');

        // Sync models (in production, use migrations)
        if (process.env.NODE_ENV === 'development') {
            await sequelize.sync({ alter: true });
            console.log('✅ Database models synchronized.');
        }

        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 Server running on ${process.env.APP_URL || `http://localhost:${PORT}`}`);
            console.log(`📊 Environment: ${process.env.NODE_ENV}`);
        });
    } catch (error) {
        console.error('❌ Unable to start server:', error);
        process.exit(1);
    }
}

startServer();

module.exports = app;
