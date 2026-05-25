import { User, Post, Image, Follow } from '../models/sync.js';

export const getPerfilusuario = async (req, res) => {
    try {
        const id = req.session.user.id;

        const userInstance = await User.findByPk(id, {
            include: [{
                model: Post,
                where: { status: 'active' },
                required: false,
                include: [{
                    model: Image,
                    required: false
                }]
            }]
        });
        if (!userInstance) {
            return res.status(404).send('Usuario no encontrado');
        }
        const usuario = userInstance.get({ plain: true });

        if (usuario.Posts && usuario.Posts.length > 0) {
            usuario.Posts.forEach(post => {
                if (post.Images && post.Images.length > 0) {
                    post.Images.forEach(image => {
                        if (image.data) {
                            image.srcBase64 = `data:image/${image.extension};base64,${image.data.toString('base64')}`;
                        }
                    });
                }
            });
        }
        res.render('profile', {
            perfilUser: usuario,
            user: req.session.user
        });

    } catch (error) {
        console.error('Error al botener el perfil', error);
        res.status(500).send('Error en el servidor' + error.message);

    }
}

export const postSeguirUsuario = async (req, res) => {

    try {
        if (!req.session || !req.session.user) {
            return res.status(401).send('Tenes que estar logueado');
        }

        const followerId = req.session.user.id;
        const { followingId } = req.body;

        await Follow.findOrCreate({
            where: {
                followerId: followerId,
                followingId: followingId
            }

        });
        res.redirect('/home');

    } catch (error) {
        console.error('Error al seguir al usuario', error);
        res.status(500).send('Error en el servidor' + error.message);
    }
}