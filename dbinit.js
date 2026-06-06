import "dotenv/config";
import sequelize from "./models/config.js";
import { User, Post, Image, Comment } from "./models/sync.js";

async function inicializarBaseDeDatos() {
    try {
        console.log("Conectando a la base de Datos");

        await sequelize.sync({ force: true });
        console.log("Estructura de tablas creada con éxito");
        console.log("Insertando datos iniciales");

        const user1 = await User.create({
            firstName: 'Fatima',
            lastName: 'Alcaraz',
            email: 'fatima@fotaza.com',
            password: 'fatima123',
            username: 'FatuAlcaraz',
            birthDate: '2000-01-01',
            rol: 'usuario'
        });

        const user2 = await User.create({
            firstName: 'Martin',
            lastName: 'Machado',
            email: 'martin@fotaza.com',
            password: 'martin123',
            username: 'TnchoMachado',
            birthDate: '2000-01-10',
            rol: 'usuario'
        });

        console.log("Usuarios de prueba creados");

        const post1 = await Post.create({
            title: 'Arte',
            description: 'Puntos de vista',
            allowComments: true,
            status: 'active',
            userId: user2.id
        });

        await Image.create({
            data: Buffer.from('/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=', 'base64'), extension: 'png',
            extension: 'jpeg',
            isMain: true,
            licencia: 'sinCopyright',
            postId: post1.id
        });

        console.log("Publicaicon e Imagen creadas correctamente");

        await Comment.create({
            content: "Tremenda foto, me encanta",
            postId: post1.id,
            userId: user1.id
        });

        console.log("Comentario de prueba insertado");

        process.exit(0);
    } catch (error) {
        console.error("Error al inicializar la Base de Datos", error);
        process.exit(1);
    }
}
inicializarBaseDeDatos();