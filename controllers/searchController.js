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

        if (query) {
            condicionesPost[Op.or] = [
                { title: { [Op.like]: `%${query}%` } },
                { description: { [Op.like]: `%${query}%` } }
            ];
        }

        let includeTag = {
            model: Tag,
            required: false
        };

        const postEncontrados = await Post.findAll({
            where: condicionesPost,
            include: [
                includeTag,
                {
                    model: User,
                    attributes: ['id', 'username']
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
            posts = posts.filter(post => {
                const coincidePost = post.title.toLowerCase().includes(query.toLowerCase()) ||
                    (post.description && post.description.toLowerCase().includes(query.toLowerCase()));

                // verifica si alguna de las etiquetas del Post coincide con la busqueda
                const coincideTag = post.Tags && post.Tags.some(t => t.name.toLowerCase().includes(query.toLowerCase()));

                return coincidePost || coincideTag;
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