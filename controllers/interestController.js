import { Message, Post, User } from '../models/sync.js';
import { alertaYVolver } from '../utils/alerta.js';
import { crearNotificacion } from './notificationController.js';

export const postMeInteresa = async (req, res) => {
    try {
        if (!req.session || !req.session.user) {
            return alertaYVolver(res, req, 401, 'Tenes que estar logueado para mostrar interes');
        }

        const buyerId = req.session.user.id;
        const { postId } = req.body;

        //busca la publicacion para saber quien es el autor
        const publicacion = await Post.findByPk(postId, {
            include: [{ model: User }]
        });

        if (!publicacion) {
            return alertaYVolver(res, req, 404, 'Publicación no encontrada')
        }

        const sellerId = publicacion.userId;

        // validar que no es el autor el buyer
        if (parseInt(buyerId) === parseInt(sellerId)) {
            return alertaYVolver(res, req, 400, 'No podes comprar tu propia puclicación')
        }

        // crea el primer mensaje automatico
        const mensajeInicial = await Message.create({
            contenido: `¡Hola! Me interesa adquirir tu fotografía "${publicacion.title || 'publicada'}"`,
            leido: false,
            emisorId: buyerId,
            receptorId: sellerId,
            postId: postId
        });

        // crea la notificacion del tipo compra
        await crearNotificacion({
            receptorId: sellerId,
            actorId: buyerId,
            tipo: 'compra',
            referenciaId: mensajeInicial.id
        });

        res.redirect(req.get('referer') || '/home');

    } catch (error) {
        console.error('Error al registrar e interesa', error);
        res.status(500).send('Error en el servidor' + error.message);
    }
}