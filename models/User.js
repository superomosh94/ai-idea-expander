const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user'
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    last_login: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Instance method to validate password
User.prototype.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password_hash);
};

// Static method to hash password
User.hashPassword = async function (password) {
    const rounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;
    return await bcrypt.hash(password, rounds);
};

// Hook to hash password before creating user
User.beforeCreate(async (user) => {
    if (user.password_hash) {
        user.password_hash = await User.hashPassword(user.password_hash);
    }
});

// Hook to hash password before updating
User.beforeUpdate(async (user) => {
    if (user.changed('password_hash')) {
        user.password_hash = await User.hashPassword(user.password_hash);
    }
});

module.exports = User;
