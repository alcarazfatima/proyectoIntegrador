import { Model, DataTypes } from "sequelize";
import sequelize from "./config.js";

export class Report extends Model { }
Report.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        tipo: {
            type: DataTypes.ENUM('imagen', 'comentario', 'usuario'),
            allowNull: false
        },
        motivo: {
            type: DataTypes.ENUM('copyright', 'spam', 'acoso', 'contenido inapropiado', 'otro'),
            allowNull: false
        },
        descripcion: {
            type: DataTypes.TEXT,
        },
        estado: {
            type: DataTypes.ENUM('pendiente', 'desestimada', 'ejecutada'),
        },
        referencia_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: 'Report',
        tableName: 'reports',
        timestamps: true,// esto habilita el createdAt y el updatedAt

    },
);