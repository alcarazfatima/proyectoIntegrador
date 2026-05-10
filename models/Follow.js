import { Model, DataTypes } from "sequelize";
import sequelize from "./config.js";

export class Follow extends Model { }

Follow.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

    },
    {
        sequelize,
        modelName: 'Follow',
        tableName: 'follows',
        timestamps: true
    },
)