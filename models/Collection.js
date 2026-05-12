import { Model, DataTypes } from "sequelize";
import sequelize from "./config.js";

export class Collection extends Model { }

Collection.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: 'Collection',
        tableName: 'collections',
        timestamps: true,// esto habilita el createdAt y el updatedAt
        paranoid: false,

    },
);