import { Model, DataTypes } from "sequelize";
import sequelize from "./config.js";

export class Like extends Model { }

Like.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
    },
    {
        sequelize,
        modelName: 'Like',
        tableName: 'likes',
        timestamps: true,// esto habilita el createdAt y el updatedAt
    }

);
