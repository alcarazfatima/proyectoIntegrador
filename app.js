import 'dotenv/config';
import express from 'express';
import authRouter from './routes/auth.js';
import postRoutes from './routes/postRoutes.js';
import sequelize from './models/config.js';
import { Post, User, Image } from './models/sync.js';
import './models/sync.js';
import im from './mockImg.js';



//CONSTANTES
const PORT = process.env.PORT;

const app = express();

// MIDDLEWARES
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MOTOR DE PLANTILLAS
app.set('view engine', 'pug');
app.set('views', './views');

// RUTAS
//app.use(auth);
app.get('/', (req, res) => {
    res.render('index');
})
app.use('/auth', authRouter);
app.use('/', postRoutes);

//CONEXION BD
sequelize.sync({ alter: true })
    .then(async () => {
        console.log('Tablas sincronizadas');
        /*
        // --- INICIO DATOS DE PRUEBA ---
      
        //Verifica si hay post
        const postCount = await Post.count();
        console.log(postCount)

        // Creamos un post de prueba. 
        const nuevoPost = await Post.create({
            title: 'Publicacion de prueba',
            description: 'Probando la arquitectura',
            allowComments: true,
            status: 'active',
            userId: 3
        });

        /* creo la imagen
        await Image.create({
            data: Buffer.from(im, 'base64'),
            extension: 'png',
            isMain: true,
            licencia: 'sinCopyright',
            postId: nuevoPost.id
        });

        console.log('Datos de prueba creados exitosamente');*/


        // --- FIN DATOS DE PRUEBA ---

        // SERVIDOR
        app.listen(PORT, (err) => {
            if (err) {
                console.error('Error al iniciar el servidor:', err);
                return;
            }
            console.log(`Servidor escuchando en el puerto ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Error sincronizancon con la BD', err);
    })