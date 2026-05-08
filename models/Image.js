import { Model, DataTypes } from "sequelize";
import sequelize from "./config.js";

export class Image extends Model { }
Image.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        data: {
            type: DataTypes.BLOB('long'),
            allowNull: false
        },
        extension: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        isMain: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
    {
        sequelize,
        modelName: 'Image',
        tableName: 'images',
        timestamps: true,// esto habilita el createdAt y el updatedAt
        paranoid: true, // habilita el borrado logico(deletedAt)

    },
);