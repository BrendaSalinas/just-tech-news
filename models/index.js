const User = require('./User');
const Post = require('./Post');

//Create associations, this is because a user can make many posts
User.hasMany(Post, {
    foreignKey: 'user_id'
});

//a post can belong to one user but not many users 
Post.belongsTo(User, {
    foreignKey: 'user_id'
});

module.exports = { User, Post };