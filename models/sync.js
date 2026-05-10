import { User } from './User.js';
import { Post } from './Post.js';
import { Image } from './Image.js';
import { Comment } from './Comment.js';
import { Like } from './Like.js';
import { Tag } from './Tag.js';
import { Follow } from './Follow.js';



User.hasMany(Post, { foreignKey: 'userId', onDelete: 'CASCADE' });
Post.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Comment, { foreignKey: 'userId' });
Comment.belongsTo(User, { foreignKey: 'userId' });
Post.hasMany(Comment, { foreignKey: 'postId', onDelete: 'CASCADE' });
Comment.belongsTo(Post, { foreignKey: 'postId' });
Post.hasMany(Image, { foreignKey: 'postId', onDelete: 'CASCADE' });
Image.belongsTo(Post, { foreignKey: 'postId' });
Post.hasMany(Like, { foreignKey: 'postId', onDelete: 'CASCADE' });
Like.belongsTo(Post, { foreignKey: 'postId' });
Post.belongsToMany(Tag, { through: 'PostTags' });
Tag.belongsToMany(Post, { through: 'PostTags' });
User.belongsToMany(User, { through: Follow, as: 'following', foreignKey: 'followerId' });
User.belongsToMany(User, { through: Follow, as: 'followers', foreignKey: 'followingId' });
User.hasMany(Like, { foreignKey: 'userId' });
Like.belongsTo(User, { foreignKey: 'userId' });

export { User, Post, Image, Comment, Like, Tag, Follow };