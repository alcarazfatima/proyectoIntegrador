import { Comment } from "../models/Comment.js";

export const postCrearComentario = async (req, res) => {

    try {
        if (!req.session || !req.session.user) {
            return res.status(401).send("Tenes que estar logueado para comentar");
        }

        const userId = req.session.user.id;
        const { postId, content } = req.body; // vienen del formulario de pug

        if (!content || content.trim === '') {
            return res.redirect('/home');
        }

        await Comment.create({
            content: content,
            postId: postId,
            userId: userId
        });

        res.redirect('/home');

    } catch (error) {
        console.error('Error al crear comentario', error)
        res.status(500).send('Error en el servidor' + error.message);
    }
};