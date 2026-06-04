import "dotenv/config";
import { Sequelize } from "sequelize";
import pg from "pg";

const sequelize = new Sequelize({
    dialect: 'postgres',
    dialectModule: pg,
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    // saco el dialectOptions y dejo que la URL de conexión o el driver manejen el SSL de forma nativa
    dialectOptions: process.env.DB_SSL === 'false' ? {} : {
        ssl: true
    }
});

export default sequelize;