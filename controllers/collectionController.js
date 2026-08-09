import { Collection, Post, Image, User, Tag } from "../models/sync.js";
import { alertaYVolver } from "../utils/alerta.js";

export const getMisColecciones = async (req, res) => {
    try {
        if (!req.session || !req.session.user) {
            return alertaYVolver(res, req, 401, "Tenes que estar logueado para ver tus colecciones");
        }

        const userId = req.session.user.id;

        // busco todas las colecciones del usuario
        const coleccionesInstances = await Collection.findAll({
            where: { userId },
            include: [{
                model: Post,
                where: { status: 'active' },
                required: false,
                include: [
                    { model: Image },
                    { model: User, attributes: ['username'] }
                ]
            }],
            order: [['createdAt', 'DESC']]

        });

        const colecciones = coleccionesInstances.map(c => {
            const col = c.get({ plain: true });
            if (col.Posts && col.Posts.length > 0) {
                col.Posts.forEach(post => {
                    if (post.Images && post.Images.length > 0) {
                        post.Images.forEach(img => {
                            if (img.data) {
                                img.srcBase64 = `data:image/${img.extension};base64,${img.data.toString('base64')}`;
                            }
                        });
                    }
                });
            }
            return col;
        });

        res.render('collections', {
            colecciones,
            user: req.session.user
        });

    } catch (error) {
        console.error("Error al obtener colecciones", error);
        res.status(500).send("Error en el servidor" + error.message);
    }
};

// crea una coleccion nueva
export const postCrearColeccion = async (req, res) => {
    try {
        if (!req.session || !req.session.user) {
            return alertaYVolver(res, req, 401, 'Tenes que estar logueado');
        }

        const { nombre } = req.body;
        if (!nombre || nombre.trim() === '') {
            return alertaYVolver(res, req, 400, 'El nombre de la colección es obligatorio');
        }
        await Collection.create({
            nombre: nombre.trim(),
            userId: req.session.user.id
        });
        res.redirect(req.get('referer') || '/collections');

    } catch (error) {
        console.error("Error al crear colecciones", error);
        res.status(500).send("Error en el servidor" + error.message)
    }
};

export const postGuardarEnColeccion = async (req, res) => {
    try {
        if (!req.session || !req.session.user) {
            return alertaYVolver(res, req, 401, 'Tenes que estar logueado');
        }

        const { collectionId, postId } = req.body;
        const userId = req.session.user.id;

        //valida que la coleccion sea del usuario logueado
        const coleccion = await Collection.findOne({
            where: { id: collectionId, userId }
        });
        if (!coleccion) {
            return alertaYVolver(res, req, 404, 'Colección no encontrada');
        }

        const post = await Post.findByPk(postId);
        if (!post) {
            return alertaYVolver(res, req, 404, 'Publicación no encontrada');
        }

        //validar que no haya duplicados en una coleccion
        const yaExiste = await coleccion.hasPost(post);
        if (yaExiste) {
            return alertaYVolver(res, req, 400, 'Esta publicación ya está guardada en esta colección');
        }

        await coleccion.addPost(post);

        res.redirect(req.get('referer') || '/home');

    } catch (error) {
        console.error("Error al crear colecciones", error);
        res.status(500).send("Error en el servidor" + error.message);
    }

};

export const postCrearYGuardar = async (req, res) => {
    try {
        if (!req.session || !req.session.user) {
            return alertaYVolver(res, req, 401, 'Tenes que estar logueado');
        }
        const { nombre, postId } = req.body;
        const userId = req.session.user.id;

        if (!nombre || nombre.trim() === '') {
            return alertaYVolver(res, req, 400, 'Ingresá un nombre para la colección')
        }

        const nuevaColeccion = await Collection.create({
            nombre: nombre.trim(),
            userId
        });

        const post = await Post.findByPk(postId);
        if (post) {
            await nuevaColeccion.addPost(post);
        }

        res.redirect(req.get('referer') || '/home');

    } catch (error) {
        console.error("Error al crear y guardar la colección", error);
        res.status(500).send("Error en el servidor" + error.message);
    }

};

export const postEliminarColeccion = async (req, res) => {
    try {
        if (!req.session || !req.session.user) {
            return alertaYVolver(res, req, 401, 'Tenes que estar logueado')
        }

        const { collectionId } = req.body;
        const userId = req.session.user.id;
        const coleccion = await Collection.findOne({
            where: { id: collectionId, userId }
        });

        if (!coleccion) {
            return alertaYVolver(res, req, 404, 'Colección no encontrada')
        }

        await coleccion.destroy();

        res.redirect('/collections');

    } catch (error) {
        console.error("Error al eliminar la colección", error);
        res.status(500).send("Error en el servidor" + error.message);
    }
};

export const postQuitarPostDeColeccion = async (req, res) => {
    try {
        if (!req.session || !req.session.user) {
            return alertaYVolver(res, req, 401, 'Tenes que estar logueado')
        }

        const { collectionId, postId } = req.body;
        const userId = req.session.user.id;
        const coleccion = await Collection.findOne({
            where: { id: collectionId, userId }
        });

        if (!coleccion) {
            return alertaYVolver(res, req, 404, 'Colección no encontrada')
        }

        const publicacion = await Post.findByPk(postId);
        if (!publicacion) {
            return alertaYVolver(res, req, 401, 'Publicación no encontrada')
        }

        // se elimina solamente el post de la tabla intermedia
        await coleccion.removePost(publicacion);

        res.redirect('/collections');

    } catch (error) {
        console.error("Error al quitar la publicación", error);
        res.status(500).send("Error en el servidor" + error.message);
    }

}