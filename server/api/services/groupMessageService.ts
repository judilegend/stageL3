import { Room, RoomMember, GroupMessage } from "../models/groupMessage";
import User from "../models/user";
import { io } from "../server";
import { Op } from "sequelize";
import sequelize from "../config/database";

class GroupMessageService {
  async createRoom(name: string, createdBy: number) {
    const room = await Room.create({
      name,
      created_by: createdBy,
    });

    const roomWithDetails = await Room.findByPk(room.id, {
      include: [
        {
          model: User,
          as: "members",
          attributes: ["id", "username"],
          through: { attributes: [] },
        },
      ],
    });

    return roomWithDetails;
  }

  async getRoomDetails(roomId: number) {
    const room = await Room.findByPk(roomId, {
      include: [
        {
          model: User,
          through: RoomMember,
          attributes: ["id", "username", "is_online"],
        },
        {
          model: User,
          as: "creator",
          attributes: ["id", "username"],
        },
      ],
    });
    return room;
  }

  async getRoomMessages(roomId: number) {
    const messages = await GroupMessage.findAll({
      where: { room_id: roomId },
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["id", "username"],
        },
      ],
      order: [["created_at", "ASC"]],
    });
    return messages;
  }

  async sendGroupMessage(roomId: number, senderId: number, content: string) {
    const message = await GroupMessage.create({
      room_id: roomId,
      sender_id: senderId,
      content,
      read: false,
    });

    const messageWithDetails = await GroupMessage.findByPk(message.id, {
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["id", "username"],
        },
      ],
    });

    console.log("Emitting new group message to room:", roomId);
    io.to(`room:${roomId}`).emit("new_group_message", messageWithDetails);

    return messageWithDetails;
  }

  async getUserRooms(userId: number) {
    try {
      const rooms = await Room.findAll({
        include: [
          {
            model: User,
            as: "members",
            through: {
              where: { user_id: userId },
              attributes: [],
            } as any,
            attributes: ["id", "username", "is_online"],
          },
          {
            model: User,
            as: "creator",
            attributes: ["id", "username"],
          },
        ],
      });

      const roomsWithUnreadCounts = await Promise.all(
        rooms.map(async (room) => {
          const unreadCount = await GroupMessage.count({
            where: {
              room_id: room.id,
              sender_id: { [Op.ne]: userId },
              read: false,
            },
          });

          return {
            ...room.toJSON(),
            unreadCount,
          };
        })
      );

      return roomsWithUnreadCounts;
    } catch (error) {
      console.error("Error in getUserRooms:", error);
      throw error;
    }
  }
  async getUnreadGroupMessagesCount(userId: number) {
    try {
      const unreadCounts = await GroupMessage.findAll({
        attributes: [
          ["room_id", "room_id"],
          [sequelize.fn("COUNT", sequelize.col("GroupMessage.id")), "count"],
        ],
        include: [
          {
            model: Room,
            as: "room",
            required: true,
            include: [
              {
                model: User,
                as: "members",
                through: RoomMember,
                where: { id: userId },
                attributes: [],
              },
            ],
          },
        ],
        where: {
          read: false,
          sender_id: { [Op.ne]: userId },
        },
        group: ["GroupMessage.room_id", "room.id"],
      });

      const countsMap: { [key: number]: number } = {};
      unreadCounts.forEach((result: any) => {
        countsMap[result.room_id] = parseInt(result.getDataValue("count"));
      });

      return countsMap;
    } catch (error) {
      console.error("Error in getUnreadGroupMessagesCount:", error);
      throw error;
    }
  }

  async addMembersToRoom(roomId: number, userIds: number[]) {
    const members = userIds.map((userId) => ({
      room_id: roomId,
      user_id: userId,
    }));
    await RoomMember.bulkCreate(members);

    const room = await this.getRoomDetails(roomId);
    userIds.forEach((userId) => {
      io.to(`user:${userId}`).emit("added_to_room", room);
    });
  }

  async markGroupMessagesAsRead(roomId: number, userId: number) {
    await GroupMessage.update(
      { read: true },
      {
        where: {
          room_id: roomId,
          sender_id: { [Op.ne]: userId },
          read: false,
        },
      }
    );

    io.to(`room:${roomId}`).emit("group_messages_read", { roomId, userId });
  }

  // async getRoomDetails(roomId: number) {
  //   const room = await Room.findByPk(roomId, {
  //     include: [
  //       {
  //         model: User,
  //         through: RoomMember,
  //         attributes: ["id", "username", "is_online"],
  //       },
  //       {
  //         model: User,
  //         as: "creator",
  //         attributes: ["id", "username"],
  //       },
  //     ],
  //   });
  //   return room;
  // }

  async removeUserFromRoom(roomId: number, userId: number) {
    await RoomMember.destroy({
      where: {
        room_id: roomId,
        user_id: userId,
      },
    });
    io.to(`user:${userId}`).emit("removed_from_room", roomId);
  }

  async deleteRoom(roomId: number) {
    await Room.destroy({
      where: { id: roomId },
    });
    io.emit("room_deleted", roomId);
  }
}

export default new GroupMessageService();
