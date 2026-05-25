import { Model, DataTypes } from "sequelize";
import sequelize from "./config.js";

export class User extends Model { }

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        firstName: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING, //255
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: true
        },
        birthDate: {
            type: DataTypes.DATEONLY,
        },
        avatar: {
            type: DataTypes.BLOB,
        },
        rol: {
            type: DataTypes.ENUM('usuario', 'validador'),
            defaultValue: 'usuario'
        }
    },
    {
        sequelize, // necesario para conectarse a la bd
        modelName: 'User', // nombre del modelo
        tableName: 'users', // nombre de la tabla
        createdAt: true,
        deletedAt: true,
    },
);