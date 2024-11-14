import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import User from "./user";

export class Room extends Model {
  public id!: number;
  public name!: string;
  public created_by!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Room.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    tableName: "rooms",
    sequelize,
    timestamps: true,
    underscored: true,
  }
);

export class RoomMember extends Model {
  public room_id!: number;
  public user_id!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

RoomMember.init(
  {
    room_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      references: {
        model: Room,
        key: "id",
      },
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    tableName: "room_members",
    sequelize,
    timestamps: true,
    underscored: true,
  }
);

export class GroupMessage extends Model {
  public id!: number;
  public content!: string;
  public room_id!: number;
  public sender_id!: number;
  public read!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

GroupMessage.init(
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
    room_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Room,
        key: "id",
      },
    },
    sender_id: {
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
      allowNull: false,
    },
  },
  {
    tableName: "group_messages",
    sequelize,
    timestamps: true,
    underscored: true,
  }
);

// Set up associations
// Update associations with clear aliases
// Room.belongsToMany(User, { through: RoomMember, as: "members" });
// User.belongsToMany(Room, { through: RoomMember, as: "rooms" });
// Room.belongsTo(User, { as: "creator", foreignKey: "created_by" });

// RoomMember.belongsTo(User, { foreignKey: "user_id" });
// RoomMember.belongsTo(Room, { foreignKey: "room_id" });
// GroupMessage.belongsTo(Room, { foreignKey: "room_id" });
// GroupMessage.belongsTo(User, { as: "sender", foreignKey: "sender_id" });
// Room.hasMany(GroupMessage, { foreignKey: "room_id" });

// Update associations with clear aliases
// First, clear all existing associations
Room.associations = {};
User.associations = {};

// Then define the associations with explicit aliases
Room.belongsToMany(User, {
  through: RoomMember,
  as: "members",
  foreignKey: "room_id",
  otherKey: "user_id",
  uniqueKey: "room_member_unique",
});

User.belongsToMany(Room, {
  through: RoomMember,
  as: "rooms",
  foreignKey: "user_id",
  otherKey: "room_id",
  uniqueKey: "room_member_unique",
});

Room.belongsTo(User, {
  as: "creator",
  foreignKey: "created_by",
});

GroupMessage.belongsTo(Room, {
  as: "room",
  foreignKey: "room_id",
});

GroupMessage.belongsTo(User, {
  as: "sender",
  foreignKey: "sender_id",
});

Room.hasMany(GroupMessage, {
  as: "messages",
  foreignKey: "room_id",
});

export default { Room, RoomMember, GroupMessage };
