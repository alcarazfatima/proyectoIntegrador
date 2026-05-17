import { Model, DataTypes } from "sequelize";
import sequelize from "./config.js";

export class Rating extends Model { }

Rating.init(
    {
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        imageId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'images',
                key: 'id'
            }
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
