# 🚀 AI Idea Expander

A powerful web application that transforms your business ideas into comprehensive strategic plans using AI. Built with Node.js, Express, MySQL, and the DeepSeek API.

![Node.js](https://img.shields.io/badge/Node.js-16+-green)
![Express](https://img.shields.io/badge/Express-4.18-blue)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Features

### 🎯 Core Functionality
- **AI-Powered Idea Expansion**: Transform brief ideas into detailed business plans using DeepSeek AI
- **Structured Analysis**: Get insights across 6 key dimensions:
  - 🎯 Problem Statement
  - 👥 Target Users
  - ⚡ Core Features
  - 🔄 User Workflow
  - ⚠️ Risks & Challenges
  - 📊 Success Metrics

### 🔐 User Management
- Secure registration and authentication
- Session-based login with bcrypt password hashing
- User profile management
- Password change functionality

### 📊 Idea Management
- Create, edit, and delete ideas
- Save ideas as drafts
- Expand ideas with AI
- Search and filter ideas
- Mark favorites
- Dashboard with statistics

### 🎨 Modern UI/UX
- Responsive design with Bootstrap 5
- Beautiful gradients and animations
- Interactive cards and hover effects
- Loading states and toast notifications
- Mobile-friendly interface

### 🛡️ Security Features
- CSRF protection
- XSS prevention
- SQL injection protection via Sequelize ORM
- Helmet.js security headers
- Rate limiting on API endpoints
- Environment-based configuration

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **MySQL** (v8.0 or higher)
- **npm** (v8 or higher)

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ai-idea-expander
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up MySQL Database

```sql
-- Login to MySQL
mysql -u root -p

-- Create database
CREATE DATABASE ai_idea_expander;

-- Create user (optional)
CREATE USER 'your_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON ai_idea_expander.* TO 'your_user'@'localhost';
FLUSH PRIVILEGES;
```

### 4. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ai_idea_expander
DB_USER=root
DB_PASSWORD=your_mysql_password

# Session Configuration
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
SESSION_NAME=ai_idea_session
SESSION_MAX_AGE=86400000

# DeepSeek API Configuration
DEEPSEEK_API_KEY=your-deepseek-api-key-here
DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions
DEEPSEEK_MODEL=deepseek-chat
DEEPSEEK_MAX_TOKENS=2000
DEEPSEEK_TEMPERATURE=0.7

# Security
BCRYPT_ROUNDS=10
CSRF_SECRET=your-csrf-secret-key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 5. Get DeepSeek API Key

1. Visit [DeepSeek Platform](https://platform.deepseek.com/)
2. Sign up for a free account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key to your `.env` file

### 6. Run Database Migration

```bash
npm run migrate
```

This will create all necessary tables in your MySQL database.

### 7. (Optional) Seed Sample Data

```bash
npm run seed
```

This creates a demo user and sample ideas:
- **Email**: demo@example.com
- **Password**: Demo@123

## 🚀 Running the Application

### Development Mode (with auto-restart)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
ai-idea-expander/
├── config/                 # Configuration files
│   ├── database.js        # Database connection
│   └── constants.js       # Application constants
├── controllers/           # Route controllers
│   ├── authController.js  # Authentication logic
│   ├── ideaController.js  # Idea management
│   └── apiController.js   # REST API endpoints
├── models/               # Sequelize models
│   ├── User.js          # User model
│   ├── Idea.js          # Idea model
│   ├── IdeaSection.js   # IdeaSection model
│   └── index.js         # Model associations
├── routes/              # Express routes
│   ├── authRoutes.js    # Auth routes
│   ├── ideaRoutes.js    # Idea routes
│   └── apiRoutes.js     # API routes
├── middleware/          # Custom middleware
│   ├── authMiddleware.js    # Auth protection
│   └── errorMiddleware.js   # Error handling
├── services/           # Business logic
│   ├── deepseekService.js   # DeepSeek API integration
│   └── ideaService.js       # Idea operations
├── utils/              # Utility functions
│   ├── validators.js   # Input validation
│   ├── helpers.js      # Helper functions
│   ├── migrate.js      # Database migration
│   └── seed.js         # Database seeding
├── views/              # EJS templates
│   ├── layouts/        # Layout templates
│   ├── partials/       # Reusable partials
│   ├── auth/           # Auth pages
│   ├── ideas/          # Idea pages
│   └── errors/         # Error pages
├── public/             # Static assets
│   ├── css/           # Stylesheets
│   └── js/            # Client-side JavaScript
├── .env.example       # Environment template
├── .gitignore        # Git ignore rules
├── package.json      # Dependencies
├── server.js         # Application entry point
└── README.md         # This file
```

## 🔑 Key Technologies

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MySQL** - Relational database
- **Sequelize** - ORM for MySQL
- **bcrypt** - Password hashing
- **express-session** - Session management

### Frontend
- **EJS** - Template engine
- **Bootstrap 5** - CSS framework
- **Vanilla JavaScript** - Client-side interactivity
- **Bootstrap Icons** - Icon library

### AI Integration
- **DeepSeek API** - AI-powered idea expansion
- **Axios** - HTTP client for API calls

### Security
- **Helmet** - Security headers
- **CSRF** - CSRF protection
- **express-rate-limit** - Rate limiting
- **express-validator** - Input validation

## 📚 API Documentation

### Authentication Endpoints

#### POST `/auth/register`
Register a new user
- Body: `{ name, email, password, password_confirm }`

#### POST `/auth/login`
Login user
- Body: `{ email, password }`

#### GET `/auth/logout`
Logout current user

### Idea Endpoints

#### GET `/ideas/dashboard`
View user's ideas dashboard

#### POST `/ideas/create`
Create a new idea
- Body: `{ title, raw_idea }`

#### POST `/ideas/:id/expand`
Expand idea with AI

#### GET `/ideas/:id`
View idea details

#### POST `/ideas/:id/edit`
Update idea
- Body: `{ title, raw_idea }`

#### POST `/ideas/:id/delete`
Delete idea

### REST API Endpoints

#### GET `/api/v1/ideas`
Get all user ideas (JSON)

#### POST `/api/v1/ideas`
Create idea via API

#### GET `/api/v1/ideas/:id`
Get single idea

#### PUT `/api/v1/ideas/:id`
Update idea via API

#### DELETE `/api/v1/ideas/:id`
Delete idea via API

#### POST `/api/v1/expand`
Expand idea via API
- Body: `{ idea_id }`

#### GET `/api/v1/stats`
Get user statistics

## 🧪 Testing

Run tests (when implemented):

```bash
npm test
```

## 🌟 Usage Guide

### Creating Your First Idea

1. **Register/Login**: Create an account or login
2. **Create Idea**: Click "New Idea" button
3. **Fill Details**: Enter title and description
4. **Save**: Save as draft
5. **Expand**: Click "Expand with AI"
6. **Review**: View AI-generated insights

### Understanding the Expansion

Each expanded idea includes:
- **Problem Statement**: What problem does this solve?
- **Target Users**: Who will use this?
- **Core Features**: What features should it have?
- **User Workflow**: How will users interact?
- **Risks & Challenges**: What could go wrong?
- **Success Metrics**: How to measure success?

## 🚢 Deployment

### Using PM2 (Recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start server.js --name "ai-idea-expander"

# Save PM2 configuration
pm2 save

# Setup startup script
pm2 startup
```

### Environment Variables for Production

Update `.env`:
```env
NODE_ENV=production
SESSION_SECRET=<strong-random-secret>
CSRF_SECRET=<strong-random-secret>
```

### Using Nginx (Optional)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔒 Security Best Practices

1. **Always use HTTPS in production**
2. **Change default session secrets**
3. **Keep dependencies updated**: `npm audit fix`
4. **Use strong passwords**
5. **Set appropriate CORS policies**
6. **Enable rate limiting**
7. **Regular database backups**

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check MySQL is running
sudo service mysql status

# Verify credentials in .env
# Test connection manually
mysql -u your_user -p ai_idea_expander
```

### DeepSeek API Error
- Verify API key is correct
- Check API quota/limits
- Ensure internet connection is stable
- Review API endpoint URL

### Port Already in Use
```bash
# Change PORT in .env file
# Or kill process using port 3000
lsof -ti:3000 | xargs kill -9
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Your Name**

## 🙏 Acknowledgments

- DeepSeek for providing the AI API
- Bootstrap team for the UI framework
- Express.js community
- All contributors and testers

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Email: support@example.com

## 🗺️ Roadmap

- [ ] Export ideas as PDF
- [ ] Share ideas with team members
- [ ] AI model selection (GPT, Claude, etc.)
- [ ] Idea templates
- [ ] Collaboration features
- [ ] Version history
- [ ] Analytics dashboard

---

**Made with ❤️ using Node.js and DeepSeek AI**
