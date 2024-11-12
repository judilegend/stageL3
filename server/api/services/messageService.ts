import { Op } from "sequelize";
import DirectMessage from "../models/message";
import User from "../models/user";
import { io } from "../server";

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
}

export default new MessageService();
