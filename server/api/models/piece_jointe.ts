import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

class PieceJointe extends Model {
  public id!: number;
  public messageId!: number;
  public filename!: string;
  public originalName!: string;
  public path!: string;
  public mimetype!: string;
  public size!: number;
}

PieceJointe.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    messageId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    groupMessageId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    originalName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mimetype: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "PieceJointe",
    tableName: "piece_jointes",
  }
);

export default PieceJointe;
