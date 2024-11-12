import { Op } from "sequelize";
import DirectMessage from "../models/message";
import User from "../models/user";
import { io } from "../server";
import sequelize from "../config/database";

class MessageService {
  async createDirectMessage(
    senderId: number,
    receiverId: number,
    content: string
  ) {
    const message = await DirectMessage.create({
      sender_id: senderId,
      receiver_id: receiverId,
      content,
    });

    const messageWithDetails = await DirectMessage.findByPk(message.id, {
      include: [
        { model: User, as: "sender", attributes: ["id", "username"] },
        { model: User, as: "receiver", attributes: ["id", "username"] },
      ],
    });

    io.to(`user:${senderId}`)
      .to(`user:${receiverId}`)
      .emit("new_message", messageWithDetails);

    return messageWithDetails;
  }
  // async getUnreadMessagesCount(userId: number) {
  //   const count = await DirectMessage.count({
  //     where: {
  //       receiver_id: userId,
  //       read: false,
  //     },
  //   });
  //   return count;
  // }

  // async markMessagesAsRead(senderId: number, receiverId: number) {
  //   await DirectMessage.update(
  //     { read: true },
  //     {
  //       where: {
  //         sender_id: senderId,
  //         receiver_id: receiverId,
  //         read: false,
  //       },
  //     }
  //   );
  // }

  async getConversation(userId1: number, userId2: number) {
    const messages = await DirectMessage.findAll({
      where: {
        [Op.or]: [
          { sender_id: userId1, receiver_id: userId2 },
          { sender_id: userId2, receiver_id: userId1 },
        ],
      },
      include: [
        { model: User, as: "sender", attributes: ["id", "username"] },
        { model: User, as: "receiver", attributes: ["id", "username"] },
      ],
      order: [["created_at", "ASC"]],
    });

    return messages;
  }
  async getUnreadMessagesCount(userId: number) {
    const unreadCounts = await DirectMessage.findAll({
      attributes: [
        "sender_id",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      where: {
        receiver_id: userId,
        read: false,
      },
      group: ["sender_id"],
    });

    const countsMap: { [key: number]: number } = {};
    unreadCounts.forEach((result: any) => {
      countsMap[result.sender_id] = parseInt(result.getDataValue("count"));
    });

    return countsMap;
  }
  async markMessagesAsRead(senderId: number, receiverId: number) {
    await DirectMessage.update(
      { read: true },
      {
        where: {
          sender_id: senderId,
          receiver_id: receiverId,
          read: false,
        },
      }
    );

    io.to(`user:${senderId}`).to(`user:${receiverId}`).emit("messages_read");
  }
}

export default new MessageService();
