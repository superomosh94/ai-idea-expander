const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const IdeaSection = sequelize.define('IdeaSection', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    idea_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'ideas',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    section_type: {
        type: DataTypes.ENUM('problem', 'users', 'features', 'workflow', 'risks', 'metrics'),
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    order_index: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    tableName: 'idea_sections',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            fields: ['idea_id', 'order_index']
        }
    ]
});

module.exports = IdeaSection;
