import { Post, Image, User, Follow } from '../models/sync.js';
import { Op } from 'sequelize';

export const getHome = async (req, res) => {
    try {

        let filtroPost = {
            status: 'active'
        }
        let condicionesImagen = null;

        if (!req.session || !req.session.user) {

            condicionesImagen = { licencia: 'sinCopyright' };
        } else {
            const miId = req.session.user.id;

            const conexiones = await Follow.findAll({
                where: { followerId: miId },
                attributes: ['followingId']//los que sigo
            });

            const idSeguidos = conexiones.map(c => c.followingId);

            //aca filtro , veo a los que sigo y a los que tienen publicacion libre
            filtroPost[Op.or] = [
                { userId: { [Op.in]: idSeguidos } },
                { userId: miId },
                { '$Images.licencia$': 'sinCopyright' }
            ];
        }


        const listaIncludes = []

        if (condicionesImagen) {
            listaIncludes.push({
                model: Image,
                where: condicionesImagen,
                required: true
            });
        } else {
            listaIncludes.push({
                model: Image,
                required: false
            });
        }

        if (User) {
            listaIncludes.push({
                model: User,
                attributes: ['username', 'firstName', 'lastName'],
                required: false // porque tengo algunos post sin userid
            });


        }
        const postsInstances = await Post.findAll({
            where: filtroPost,
            include: listaIncludes,
            order: [['createdAt', 'DESC']]
        });

        const posts = postsInstances.map(instancia => instancia.get({ plain: true }))

        if (posts && posts.length > 0) {
            posts.forEach(post => {
                // Verificamos si el post tiene imágenes
                if (post.Images && post.Images.length > 0) {
                    // RECORREMOS TODAS LAS IMÁGENES DEL POST
                    post.Images.forEach(image => {
                        if (image.data) {
                            image.srcBase64 = `data:image/${image.extension};base64,${image.data.toString('base64')}`;
                        }
                    });
                }
            });
        }

        res.render('home', {
            posts: posts || [],
            user: req.session?.user || null
        });

    } catch (error) {
        console.error("Error en getHome:", error);
        res.status(500).send("Error en el servidor: " + error.message);
    }
};
export const getCrearPost = (req, res) => {
    res.render('newPost', { user: req.session?.user });
};

// 3. POST: Recibe las fotos y los textos, y los guarda en la base de datos
export const postCrearPost = async (req, res) => {
    try {
        if (!req.session || !req.session.user) {
            return res.status(401).send('Tenés que estar logueado para crear una publicación.');
        }
        const { title, description, licencia } = req.body;
        const files = req.files; // Acá aloja Multer los archivos cargados

        if (!files || files.length === 0) {
            return res.status(400).send('Tenés que subir al menos una imagen.');
        }

        // 1. Creamos el registro del Posteo en la base de datos
        const nuevoPost = await Post.create({
            title,
            description,
            allowComments: true,
            status: 'active',
            userId: req.session.user.id
        });

        // 2. Recorremos todas las imágenes del array y las guardamos asociadas al post
        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            // Obtenemos la extensión del archivo original (ej: jpg, png)
            const extension = file.originalname.split('.').pop();

            await Image.create({
                data: file.buffer,          // El binario guardado temporalmente en memoria
                extension: extension,
                isMain: i === 0,            // La primera foto se marca como principal
                licencia: licencia,         // 'conCopyright' o 'sinCopyright'
                postId: nuevoPost.id        // Clave foránea que bindea la foto al post
            });
        }

        // Al terminar, volvemos al Home para ver los cambios
        res.redirect('/home');

    } catch (error) {
        console.error('Error al crear la publicación:', error);
        res.status(500).send('Error interno del servidor: ' + error.message);
    }
};