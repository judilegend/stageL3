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
  },
  {
    sequelize,
    modelName: "Sprint",
    tableName: "sprints",
  }
);

const defineAssociations = () => {
  Sprint.hasMany(Tache, {
    foreignKey: "sprintId",
    as: "tasks",
  });
};

setTimeout(defineAssociations, 0);

export default Sprint;
