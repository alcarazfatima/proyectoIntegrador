import { Model, DataTypes } from "sequelize";
import sequelize from "./config.js";

export class Notification extends Model { }

Notification.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        tipo: {
            type: DataTypes.ENUM('like', 'comentario', 'seguimiento', 'compra', 'denuncia'),
            allowNull: false
        },
        referenciaId: {
            type: DataTypes.INTEGER,
            allowNull: true,

        },
        leida: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }

    },
    {
        sequelize,
        modelName: 'Notification',
        tableName: 'notifications',
        timestamps: true,
    },
);