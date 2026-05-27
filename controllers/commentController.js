import { Comment, Post, Notification } from "../models/sync.js";

export const postCrearComentario = async (req, res) => {

    try {
        if (!req.session || !req.session.user) {
            return res.status(401).send("Tenes que estar logueado para comentar");
        }

        const userId = req.session.user.id;
        const { postId, content } = req.body; // vienen del formulario de pug

        if (!content || content.trim() === '') {
            return res.redirect('/home');
        }

        const nuevoComentario = await Comment.create({
            content: content,
            postId: postId,
            userId: userId
        });

        //busco la publicaicon para saber quien en el dueño del post (el receptor)
        const publicacion = await Post.findByPk(postId);

        if (publicacion) {
            // solo cuando el comentario es de otro, no del dueño del post
            if (parseInt(userId) !== parseInt(publicacion.userId)) {
                await Notification.create({
                    tipo: 'comentario',
                    receptorId: publicacion.userId,
                    actorId: userId,
                    referenciaId: nuevoComentario.id
                });
            }
        }

        res.redirect(req.get('referer') || '/home');

    } catch (error) {
        console.error('Error al crear comentario', error)
        res.status(500).send('Error en el servidor' + error.message);
    }
};