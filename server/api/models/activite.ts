import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import Tache from "./tache";
import PieceJointe from "./piece_jointe";
class Activite extends Model {
  public id!: number;
  public workPackageId!: number;
  public name!: string;
  public description!: string;
}

Activite.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    workPackageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Activite",
  }
);

Activite.hasMany(Tache, {
  foreignKey: "activiteId",
  as: "Taches",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
// Add this after the existing relationships
Activite.hasMany(PieceJointe, {
  foreignKey: "activiteId",
  as: "pieceJointes",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

export default Activite;
