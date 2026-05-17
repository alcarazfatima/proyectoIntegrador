import { Model, DataTypes } from "sequelize";
import sequelize from "./config.js";

export class Message extends Model { }
Message.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        contenido: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        leido: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },

    },
    {
        sequelize,
        modelName: 'Message',
        tableName: 'messages',
        timestamps: true,// esto habilita el createdAt y el updatedAt
    },
);