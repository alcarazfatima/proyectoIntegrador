import { User } from './User.js';
import { Post } from './Post.js';
import { Image } from './Image.js';

User.hasMany(Post, { foreignKey: 'userId', onDelete: 'CASCADE' });
Post.belongsTo(User, { foreignKey: 'userId' });

export { User, Post, Image };