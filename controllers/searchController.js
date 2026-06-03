import { Tag, Post, Image, User, Rating } from '../models/sync.js';
import { Op } from 'sequelize';

export const getBuscarPublicaciones = async (req, res) => {
    try {
        const { query, licencia } = req.query;

        let condicionesImagen = {};

        if (!req.session || !req.session.user) {
            condicionesImagen.licencia = 'sinCopyright';
        } else if (licencia) {
            condicionesImagen.licencia = licencia;
        }

        let condicionesPost = { status: 'active' };

        const postEncontrados = await Post.findAll({
            where: condicionesPost,
            include: [
                {
                    model: Tag,
                    required: false
                },
                {
                    model: User,
                    attributes: ['id', 'username'],
                    required: false
                },
                {
                    model: Image,
                    where: condicionesImagen,
                    required: true,
                    include: [{ model: Rating, required: false }],
                }
            ],
            order: [['createdAt', 'DESC']],
        });

        let posts = postEncontrados.map(p => {
            const post = p.get({ plain: true });

            if (!post.User) {
                post.User = {
                    id: null,
                    username: 'usuario_eliminado'
                };
            }
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
            return post;
        });

        if (query) {
            const queryLimpia = query.replace('@', '').toLowerCase().trim();

            posts = posts.filter(post => {
                // ¿Coincide el título o la descripción?
                const coincidePost = (post.title && post.title.toLowerCase().includes(queryLimpia)) ||
                    (post.description && post.description.toLowerCase().includes(queryLimpia));

                // ¿Coincide alguna de las etiquetas?
                const coincideTag = post.Tags && post.Tags.some(t => t.name && t.name.toLowerCase().includes(queryLimpia));

                // ¿Coincide el nombre del fotógrafo?
                const coincideUsuario = post.User && post.User.username.toLowerCase().includes(queryLimpia);

                // Si se cumple CUALQUIERA de las tres, la publicación se muestra
                return coincidePost || coincideTag || coincideUsuario;
            });
        }

        res.render('search', {
            posts,
            user: req.session?.user || null,
            filtrosActuales: { query: query || '', licencia: licencia || '' }
        });

    } catch (error) {
        console.error('Error en la busqueda', error);
        res.status(500).send('Error en el servidor ' + error.message);
    }
};