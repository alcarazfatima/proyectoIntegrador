import sequelize from '../models/config.js';
import { Post, Image, User, Follow, Comment, Rating, Tag } from '../models/sync.js';
import { Op } from 'sequelize';
import { alertaYVolver } from '../utils/alerta.js';

export const getHome = async (req, res) => {
    try {
        let filtroPost = { status: 'active' };
        let condicionesImagen = null;

        if (!req.session || !req.session.user) {
            condicionesImagen = { licencia: 'sinCopyright' };
        } else {
            const miId = req.session.user.id;

            const conexiones = await Follow.findAll({
                where: { followerId: miId },
                attributes: ['followingId']
            });

            const idSeguidos = conexiones.map(c => c.followingId);

            filtroPost[Op.or] = [
                { userId: { [Op.in]: idSeguidos } },
                { userId: miId },
                { '$Images.licencia$': 'sinCopyright' }
            ];
            req.listaSeguidos = idSeguidos;
        }

        const listaIncludes = [];

        // Traemos el modelo Image limpio, incluyendo sus Ratings para calcular el promedio en JS
        if (condicionesImagen) {
            listaIncludes.push({
                model: Image,
                where: condicionesImagen,
                required: true,
                include: [{ model: Rating, required: false }] // Trae los votos asociados
            });
        } else {
            listaIncludes.push({
                model: Image,
                required: false,
                include: [{ model: Rating, required: false }]
            });
        }

        if (User) {
            listaIncludes.push({
                model: User,
                attributes: ['username', 'firstName', 'lastName'],
                required: false
            });
        }

        listaIncludes.push({
            model: Comment,
            required: false,
            include: [{
                model: User,
                attributes: ['username'],
                required: false
            }]
        });

        listaIncludes.push({
            model: Tag,
            attributes: ['name'],
            through: { attributes: [] },
            required: false
        });

        const postsInstances = await Post.findAll({
            where: filtroPost,
            include: listaIncludes,
            order: [['createdAt', 'DESC']]
        });

        // PROCESAMIENTO SEGURO EN JAVASCRIPT (Cero cuelgues de SQL)
        const posts = postsInstances.map(instancia => {
            const p = instancia.get({ plain: true });

            if (p.Images && p.Images.length > 0) {
                p.Images.forEach(img => {
                    // Calculamos el promedio manualmente recorriendo el array de Ratings que nos trajo Sequelize
                    if (img.Ratings && img.Ratings.length > 0) {
                        const suma = img.Ratings.reduce((acc, r) => acc + r.score, 0);
                        img.promedioVotos = Math.round(suma / img.Ratings.length);
                        img.cantidadVotos = img.Ratings.length;
                    } else {
                        img.promedioVotos = 0; // Si no tiene votos, arranca en cero
                        img.cantidadVotos = 0;
                    }

                    // Convertimos el binario a Base64 para Pug
                    if (img.data) {
                        img.srcBase64 = `data:image/${img.extension};base64,${img.data.toString('base64')}`;
                    }
                });
            }
            return p;
        });

        res.render('home', {
            posts: posts || [],
            user: req.session?.user || null,
            misSeguidos: req.listaSeguidos || []
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
            return alertaYVolver(res, req, 401, 'Tenes que estar logueado para crear una publicación');
        }
        const { title, description, licencia, tags } = req.body;
        const files = req.files; // Acá aloja Multer los archivos cargados

        if (!files || files.length === 0) {
            return alertaYVolver(res, req, 400, 'Tenes que subir al menos una imagen');
        }

        // 1. Creamos el registro del Posteo en la base de datos
        const nuevoPost = await Post.create({
            title,
            description,
            allowComments: true,
            status: 'active',
            userId: req.session.user.id
        });

        // PROCESAMOS LAS ETIQUETAS Y LAS GUARDAMOS EN LA RELACION
        if (tags && tags.trim() !== "") {
            // hace un arreglo de etiquetas, si hay mas de una
            const listaTags = tags.split(',')
                .map(t => t.trim().replace('#', '').toLowerCase())
                .filter(t => t.length > 0); //para no meter etiquetas vacias

            const tagsInstancias = [];

            for (const nombreTag of listaTags) {
                // findOrCreate busca si el tag ya existe 
                // si existe lo usa, si no, lo crea de cero
                const [tagInstancia] = await Tag.findOrCreate({
                    where: { name: nombreTag }
                });
                tagsInstancias.push(tagInstancia);
            }

            // para cargarlas en la tabla intermedia
            await nuevoPost.addTags(tagsInstancias);
        }

        // Recorremos todas las imágenes del array y las guardamos asociadas al post
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