import { Post, Image } from '../models/sync.js'

export const getHome = async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: [{ model: Image }]
        });

        // Solo si hay posts, intentamos procesar
        if (posts && posts.length > 0) {
            posts.forEach(post => {
                // Chequeo de seguridad: ¿Tiene imágenes? ¿La primera tiene datos?
                if (post.Images && post.Images.length > 0 && post.Images[0].data) {
                    const image = post.Images[0];
                    image.srcBase64 = `data:image/${image.extension};base64,${image.data.toString('base64')}`;
                } else {
                    // Si no hay imagen en la DB, le asignamos una marca para el Pug
                    post.noImage = true;
                }
            });
        }

        res.render('home', { posts: posts || [], user: null });
    } catch (error) {
        console.error("Error detallado:", error);
        res.status(500).send("Error en el servidor: " + error.message);
    }
};