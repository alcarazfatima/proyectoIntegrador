import { User, Post, Image, Follow, Notification, Rating, Comment, Tag } from '../models/sync.js';
import { alertaYVolver } from '../utils/alerta.js';

export const getPerfilusuario = async (req, res) => {
    try {
        const { username } = req.params;

        // filtro de imagenes segun la sesion
        let condicionesImagen = null;

        // si no esta logueado SOLO puede ver contenidopublico
        if (!req.session || !req.session.user) {
            condicionesImagen = { licencia: 'sinCopyright' };
        }

        const userInstance = await User.findOne({
            where: { username: username },
            include: [{
                model: Post,
                where: { status: 'active' },
                required: false,
                include: [
                    {
                        model: Image,
                        // filtro si existe (si es invitado, filtra; si esta logueado pasa)
                        where: condicionesImagen,
                        required: condicionesImagen ? true : false, // si filtra la imagen tiene q cumplir la condicion
                        include: [{ model: Rating, required: false }]
                    },
                    {
                        model: Comment,
                        required: false,
                        include: [{
                            model: User,
                            attributes: ['username'],
                            required: false
                        }]
                    },
                    {
                        model: Tag,
                        attributes: ['name'],
                        through: { attributes: [] },
                        required: false
                    }
                ]
            }],
            order: [[Post, 'createdAt', 'DESC']]
        });

        if (!userInstance) {
            return alertaYVolver(res, req, 404, 'Usuario no encontrado');
        }

        const perfilId = userInstance.id;
        const cantidadSeguidos = await Follow.count({ where: { followerId: perfilId } });
        const cantidadSeguidores = await Follow.count({ where: { followingId: perfilId } });
        const usuario = userInstance.get({ plain: true });

        // procesa las imagenes para el promedio seguro y Base64
        if (usuario.Posts && usuario.Posts.length > 0) {
            usuario.Posts.forEach(post => {
                if (post.Images && post.Images.length > 0) {
                    post.Images.forEach(image => {
                        if (image.Ratings && image.Ratings.length > 0) {
                            const suma = image.Ratings.reduce((acc, r) => acc + r.score, 0);
                            image.promedioVotos = Math.round(suma / image.Ratings.length);
                        } else {
                            image.promedioVotos = 0;
                        }

                        if (image.data) {
                            image.srcBase64 = `data:image/${image.extension};base64,${image.data.toString('base64')}`;
                        }
                    });
                }
            });
        }

        const esMiPerfil = req.session.user && req.session.user.id === perfilId;

        let yaLoSigo = false;

        if (req.session && req.session.user && !esMiPerfil) {

            const existeSeguimiento = await Follow.findOne({
                where: {
                    followerId: req.session.user.id,
                    followingId: perfilId
                }
            });

            yaLoSigo = !!existeSeguimiento;
        }
        res.render('profile', {
            perfilUser: usuario,
            user: req.session?.user || null, //por las dudas navegacion segura
            contadorSeguidos: cantidadSeguidos,
            contadorSeguidores: cantidadSeguidores,
            esMiPerfil: esMiPerfil,
            yaLoSigo: yaLoSigo
        });

    } catch (error) {
        console.error('Error al obtener el perfil', error);
        res.status(500).send('Error en el servidor: ' + error.message);
    }
};

export const postSeguirUsuario = async (req, res) => {

    try {
        if (!req.session || !req.session.user) {
            return alertaYVolver(res, req, 401, 'Tenes que estar logueado');
        }

        const followerId = req.session.user.id;
        const { followingId } = req.body;

        const [follow, created] = await Follow.findOrCreate({
            where: {
                followerId: followerId,
                followingId: followingId
            }

        });

        if (created) {
            await Notification.create({
                tipo: 'seguimiento',
                receptorId: followingId,
                actorId: followerId,
                referenciaId: follow.id,
                leida: false
            })
        }

        res.redirect(req.get('referer') || `/profile/${followingId}`);

    } catch (error) {
        console.error('Error al seguir al usuario', error);
        res.status(500).send('Error en el servidor' + error.message);
    }
};

export const postDejarDeSeguir = async (req, res) => {
    try {
        if (!req.session || !req.session.user) {
            return alertaYVolver(res, req, 401, 'Tenes que estar logueado');
        }

        const followerId = req.session.user.id;
        const { followingId } = req.body;

        const eliminado = await Follow.destroy({
            where: {
                followerId: followerId,
                followingId: followingId
            }
        });

        if (eliminado === 0) {
            return alertaYVolver(res, req, 400, 'No estabas siguiendo a este usuario');
        }

        res.redirect(req.get('referer') || '/home');

    } catch (error) {
        console.error('Error al dejar de seguir al usuario', error);
        res.status(500).send('Error en el servidor ' + error.message);
    }

}