import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import User from "./user";
import PieceJointe from "./piece_jointe";

class DirectMessage extends Model {
  public id!: number;
  public content!: string;
  public sender_id!: number;
  public receiver_id!: number;
  public read!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

DirectMessage.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    sender_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    receiver_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "direct_messages",
    sequelize,
    timestamps: true,
    underscored: true,
  }
);

DirectMessage.belongsTo(User, { as: "sender", foreignKey: "sender_id" });
DirectMessage.belongsTo(User, { as: "receiver", foreignKey: "receiver_id" });
DirectMessage.hasMany(PieceJointe, {
  foreignKey: "messageId",
  as: "attachments",
});

export default DirectMessage;
