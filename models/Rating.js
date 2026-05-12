import { Model, DataTypes } from "sequelize";
import sequelize from "./config.js";

export class Rating extends Model { }

Rating.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 5
            }
        }
    },
    {
        sequelize,
        modelName: 'Rating',
        tableName: 'ratings',
        timestamps: true,// esto habilita el createdAt y el updatedAt
    }

);
