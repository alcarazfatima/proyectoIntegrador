import { Rating, Image, Notification, Post } from '../models/sync.js';
import { alertaYVolver } from '../utils/alerta.js';

export const postValorar = async (req, res) => {
    try {
        if (!req.session || !req.session.user) {
            return alertaYVolver(res, req, 401, 'Tenes que estar logueado para valorar');
        }

        const userId = req.session.user.id;
        const { imageId, score } = req.body;

        const foto = await Image.findByPk(imageId, {
            include: [{ model: Post }]
        });

        if (foto && foto.Post && parseInt(userId) === parseInt(foto.Post.userId)) {
            return alertaYVolver(res, req, 403, "No podes valorar tu propia imagen")
        }

        const [valoracion, created] = await Rating.findOrCreate({
            where: { userId, imageId },
            defaults: { score: parseInt(score) }
        });

        if (!created) {
            return alertaYVolver(res, req, 400, "Ya valoraste esta imagen")
        }

        if (foto) {
            await Notification.create({
                tipo: 'valoracion',
                receptorId: foto.Post.userId,
                actorId: userId,
                referenciaId: imageId,
                leida: false
            });
            console.log("¡Notificación de valoración creada con éxito!");
        }
        res.redirect(req.get('referer') || '/home');
    } catch (error) {
        console.error('Error al valorar imagen', error);
        res.status(500).send('Error en el servidor ' + error.message);
    }
}