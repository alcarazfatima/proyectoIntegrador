import { Model, DataTypes } from "sequelize";
import sequelize from "./config.js";

export class Post extends Model { }
Post.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING(150),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT
        },
        allowComments: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        status: {
            type: DataTypes.ENUM('active', 'removed', 'reported')
        }
    },
    {
        sequelize,
        modelName: 'Post',
        tableName: 'posts',
        timestamps: true
    },
);