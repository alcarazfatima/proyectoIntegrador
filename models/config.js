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
    dialectOptions: process.env.DB_SSL === 'false' ? {} : {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

export default sequelize;