import { User } from './User.js';
import { Post } from './Post.js';
import { Image } from './Image.js';
import { Comment } from './Comment.js';
import { Like } from './Like.js';
import { Tag } from './Tag.js';
import { Follow } from './Follow.js';
import { Report } from './Report.js';
import { Notification } from './Notification.js';
import { Collection } from './Collection.js';

//relaciones de usuario

User.hasMany(Post, { foreignKey: 'userId', onDelete: 'CASCADE' });
Post.belongsTo(User, { foreignKey: 'userId' });
User.belongsToMany(User, { through: Follow, as: 'following', foreignKey: 'followerId' });
User.belongsToMany(User, { through: Follow, as: 'followers', foreignKey: 'followingId' });
User.hasMany(Like, { foreignKey: 'userId' });
Like.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Comment, { foreignKey: 'userId' });
Comment.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Report, { foreignKey: 'userId' })
Report.belongsTo(User, { as: 'denunciante', foreignKey: 'userId' })


//relaciones de publicacion
Post.hasMany(Comment, { foreignKey: 'postId', onDelete: 'CASCADE' });
Comment.belongsTo(Post, { foreignKey: 'postId' });
Post.hasMany(Image, { foreignKey: 'postId', onDelete: 'CASCADE' });
Image.belongsTo(Post, { foreignKey: 'postId' });

// relaciones de imagen 
Image.hasMany(Like, { foreignKey: 'imageId', onDelete: 'CASCADE' });
Like.belongsTo(Image, { foreignKey: 'imageId' });
Image.belongsToMany(Tag, { through: 'ImageTags', foreignKey: 'imageId' });
Tag.belongsToMany(Image, { through: 'ImageTags', foreignKey: 'tagId' });

//relacion de notificacion
Notification.hasMany(User, { as: 'recipient', foreignKey: 'recipienteId' });
User.hasMany(Notification, { foreignKey: 'recipientid' });
Notification.belongsTo(User, { as: 'actor', foreignKey: 'actorId' });


export { User, Post, Image, Comment, Like, Tag, Follow, Report, Notification };