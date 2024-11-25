import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

class Subscription extends Model {
  public id!: number;
  public userId!: number;
  public endpoint!: string;
  public p256dh!: string;
  public auth!: string;
}

Subscription.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    endpoint: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    p256dh: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    auth: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Subscription",
  }
);

export default Subscription;
