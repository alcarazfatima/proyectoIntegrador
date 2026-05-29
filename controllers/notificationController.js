import { Notification, User } from '../models/sync.js';

export const getNotification = async (req, res) => {
    try {
        if (!req.session || !req.session.user) {
            return res.redirect('auth/login');
        }

        const userId = req.session.user.id;

        const notificaiones = await Notification.findAll({
            where: { receptorId: userId },
            include: [{
                model: User,
                as: 'actor', // datos del que realizo la accion
                attributes: ['username']
            }],
            order: [['createdAt', 'DESC']] // las mas nuevas primero
        });

        res.render('notification', {
            notificaciones: notificaiones,
            user: req.session.user
        });
    } catch (error) {
        console.error('Error al obtener notificaiones', error);
        res.status(500).send('Error en el servidor' + error.message);

    }
};

export const postMarcarLeida = async (req, res) => {
    try {
        const { id } = req.params;
        await Notification.update(
            { leida: true },
            { where: { id: id } }

        );

        res.redirect('/notifications');

    } catch (error) {
        console.error('Error al marcar notificaion como leida', error);
        res.status(500).send('Error en el serividor' + error.message);
    }
};