import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import Tache from "./tache";

class Sprint extends Model {
  public id!: number;
  public name!: string;
  public startDate!: Date;
  public endDate!: Date;
  public goal!: string;
  public progress!: number;
  public status!: "planned" | "in_progress" | "completed";
  public tacheId!: number | null;
  public tasks?: Tache[];
}

Sprint.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    goal: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    progress: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM("planned", "in_progress", "in_review", "completed"),
      allowNull: false,
      defaultValue: "planned",
    },
    tacheId: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      references: {
        model: Tache,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "Sprint",
    tableName: "sprints",
  }
);

Sprint.hasMany(Tache, {
  foreignKey: "tacheId",
  as: "tasks",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

export default Sprint;
