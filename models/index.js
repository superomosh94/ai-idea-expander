const User = require('./User');
const Idea = require('./Idea');
const IdeaSection = require('./IdeaSection');

// Define associations
User.hasMany(Idea, {
    foreignKey: 'user_id',
    as: 'ideas',
    onDelete: 'CASCADE'
});

Idea.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

Idea.hasMany(IdeaSection, {
    foreignKey: 'idea_id',
    as: 'sections',
    onDelete: 'CASCADE'
});

IdeaSection.belongsTo(Idea, {
    foreignKey: 'idea_id',
    as: 'idea'
});

module.exports = {
    User,
    Idea,
    IdeaSection
};
