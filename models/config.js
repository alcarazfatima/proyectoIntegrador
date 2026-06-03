import "dotenv/config";
import { Sequelize } from "sequelize";
import pg from "pg"; // agrego para vercel

const sequelize = new Sequelize({
    dialect: 'postgres',
    dialectModule: pg, // y esto tambien para que vercel "encuentre pg"
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    dialectOptions: {
        ssl: process.env.DB_SSL === 'false' ? false : {
            require: true,
            rejectUnauthorized: false
        }
    }
});

export default sequelize;