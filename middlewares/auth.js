import { Notification, Message } from "../models/sync.js";

export async function auth(req, res, next) {
    res.locals.currentPath = req.path;
    try {
        const miId = req.session.user.id;
        if (miId) {
            res.locals.notiNoLeida = await Notification.count({
                where: {
                    receptorId: miId,
                    leida: false
                }
            });

            res.locals.mensajesSinLeer = await Message.count({
                where: {
                    receptorId: miId,
                    leido: false
                }
            })
        } else {
            res.locals.notiNoLeida = 0;
            res.locals.mensajesSinLeer = 0;
        }
    } catch (error) {
        console.error('Error al contar notificaiones en auth middleware', error);
        res.locals.notiNoLeida = 0;
        res.locals.mensajesSinLeer = 0;
    }
    next();
}