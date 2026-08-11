import { Message, User, Post } from '../models/sync.js';
import { Op } from 'sequelize';
import { alertaYVolver } from '../utils/alerta.js';

// ver el chat con un usuario especifico
export const getChatConUsuario = async (req, res) => {
    try {
        if (!req.session || !req.session.user) {
            return res.redirect('/auth/login')
        }

        const miId = req.session.user.id;
        const otroUsuarioId = req.params.userId;

        //busco los datos del otro usuario
        const otroUsuario = await User.findByPk(otroUsuarioId, {
            attributes: ['id', 'username', 'firstName', 'lastName']
        });

        if (!otroUsuario) {
            return alertaYVolver(res, req, 401, 'Usuario no encontrado');
        }

        await Message.update(
            { leido: true },
            {
                where: {
                    emisorId: otroUsuarioId,
                    receptorId: miId,
                    leido: false
                }
            }
        );

        //traigo el historial de mensajes
        const mensajes = await Message.findAll({
            where: {
                [Op.or]: [
                    { emisorId: miId, receptorId: otroUsuarioId },
                    { emisorId: otroUsuarioId, receptorId: miId }
                ]
            },
            order: [['createdAt', 'ASC']]
        });

        res.render('chat', {
            user: req.session.user,
            otroUsuario,
            mensajes
        });

    } catch (error) {
        console.error('Erroral cargar el chat', error);
        res.status(500).send('Error en el servidor' + error.message);
    }
};

export const postEnviarMensaje = async (req, res) => {
    try {
        if (!req.session || !req.session.user) {
            return res.redirect('/auth/login');
        }

        const emisorId = req.session.user.id;
        const { receptorId, contenido } = req.body;

        if (!contenido || contenido.trim() === '') {
            return res.redirect('back');
        }

        await Message.create({
            contenido: contenido.trim(),
            leido: false,
            emisorId,
            receptorId
        });

        res.redirect(`/mensajes/${receptorId}`);
    } catch (error) {
        console.error('Error al enviar mensaje:', error);
        res.status(500).send('Error en el servidor: ' + error.message);
    }
};

export const getConversaciones = async (req, res) => {
    try {
        const currentUser = req.session.user;
        if (!currentUser) {
            return res.redirect('/auth/login');
        }

        const miId = currentUser.id;

        //busco todos los mensajes donde soy el emisor o receptor
        const mensajes = await Message.findAll({
            where: {
                [Op.or]: [{ emisorId: miId }, { receptorId: miId }]
            },
            include: [
                { model: User, as: 'emisor', attributes: ['id', 'username'] },
                { model: User, as: 'receptor', attributes: ['id', 'username'] }
            ],
            order: [['createdAt', 'DESC']]
        });

        //agrupapara obtener la ultima conversaicon con cada usuario
        const conversacionesMap = new Map();
        mensajes.forEach(msg => {
            const otroUsuario = msg.emisorId === miId ? msg.receptor : msg.emisor;
            if (otroUsuario && !conversacionesMap.has(otroUsuario.id)) {
                conversacionesMap.set(otroUsuario.id, {
                    usuario: otroUsuario,
                    ultimoMensaje: msg.contenido,
                    fecha: msg.createdAt,
                    noLeido: msg.receptorId === miId && !msg.leido
                });
            }
        });

        const conversaciones = Array.from(conversacionesMap.values());

        res.render('conversaciones', {
            user: currentUser,
            conversaciones
        });
    } catch (error) {
        console.error('Error al cargar conversaciones', error);
        res.status(500).send('Error en el servidor' + error.message);
    }
}