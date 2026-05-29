import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import authRouter from './routes/auth.js';
import postRoutes from './routes/postRoutes.js';
import userRoutes from './routes/userRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import sequelize from './models/config.js';
import { Post, User, Image, Notification } from './models/sync.js';
import './models/sync.js';


//CONSTANTES
const PORT = process.env.PORT;

const app = express();

// MOTOR DE PLANTILLAS
app.set('view engine', 'pug');
app.set('views', './views');


// MIDDLEWARES
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'claveSecretaParaFotazaULP', // Frase para encriptar la pulsera
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Ponemos false porque estamos trabajando en localhost
        maxAge: 1000 * 60 * 60 * 24 // La sesión dura 1 día entero
    }
}));

app.use(async (req, res, next) => {


})

// RUTAS
//app.use(auth);
app.get('/', (req, res) => {
    res.render('index');
})
app.use('/auth', authRouter);
app.use('/', postRoutes);
app.use('/', userRoutes);
app.use('/', commentRoutes);
app.use('/', notificationRoutes)

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


        await Image.create({
            data: Buffer.from(im, 'base64'),
            extension: 'png',
            isMain: true,
            licencia: 'sinCopyright',
            postId: 1
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