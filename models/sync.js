import { User } from './User.js';
import { Post } from './Post.js';
import { Image } from './Image.js';
import { Comment } from './Comment.js';
import { Rating } from './Rating.js';
import { Tag } from './Tag.js';
import { Follow } from './Follow.js';
import { Report } from './Report.js';
import { Notification } from './Notification.js';
import { Collection } from './Collection.js';

//relaciones de usuario

User.hasMany(Post, { foreignKey: 'userId', onDelete: 'CASCADE' });
Post.belongsTo(User, { foreignKey: 'userId' });

User.belongsToMany(User, {
    through: Follow,
    as: 'following',
    foreignKey: 'followerId'
});
User.belongsToMany(User, {
    through: Follow,
    as: 'followers',
    foreignKey: 'followingId'
});


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

Image.belongsToMany(Tag, {
    through: 'ImageTags',
    foreignKey: 'imageId'
});
Tag.belongsToMany(Image, {
    through: 'ImageTags',
    foreignKey: 'tagId'
});

//relacion de notificacion
Notification.belongsTo(User, { as: 'recipient', foreignKey: 'recipientId' });
User.hasMany(Notification, { foreignKey: 'recipientId' });
Notification.belongsTo(User, { as: 'actor', foreignKey: 'actorId' });

//relacion de colecciones

User.hasMany(Collection, { foreignKey: 'userId' });
Collection.belongsTo(User, { foreignKey: 'userId' });

Collection.belongsToMany(Post, {
    through: 'collection_posts',
    foreignKey: 'collectionId',
    otherKey: 'postId'
});
Post.belongsToMany(Collection, {
    through: 'collection_posts',
    foreignKey: 'postId',
    otherKey: 'collectionId'
});

// relacion de usuario y sus favoritos
User.belongsToMany(Post, {
    through: 'userFavorites',
    as: 'favorites',
    foreignKey: 'userId'
});
Post.belongsToMany(User, {
    through: 'userFavorites',
    as: 'favoritedBy',
    foreignKey: 'postId'
});

//relacion de valoracion ex like 
User.belongsToMany(Image, {
    through: Rating,
    foreignKey: 'userId'
});

Image.belongsToMany(User, {
    through: Rating,
    foreignKey: 'imageId'
});


export { User, Post, Image, Comment, Rating, Tag, Follow, Report, Notification, Collection };