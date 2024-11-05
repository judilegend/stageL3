import { Op } from "sequelize";
import DirectMessage from "../models/direct_message";
import { io } from "../server";

export class MessageService {
  // Get conversation between two users with pagination
  static async getConversation(
    user1Id: string,
    user2Id: string,
    limit = 50,
    offset = 0
  ) {
    try {
      const messages = await DirectMessage.getConversationUsingProc(
        user1Id,
        user2Id,
        limit,
        offset
      );
      return messages;
    } catch (error) {
      throw new Error("Failed to fetch conversation");
    }
  }

  // Send a direct message
  static async sendDirectMessage(
    senderId: number,
    receiverId: number,
    content: string
  ) {
    try {
      const message = await DirectMessage.create({
        senderId,
        receiverId,
        content,
        read: false,
      });

      // Emit real-time notification
      io.to(`user:${receiverId}`).emit("new_message", {
        ...message.toJSON(),
        sender: senderId,
      });

      return message;
    } catch (error) {
      throw new Error("Failed to send message");
    }
  }

  // Get unread messages count for a user
  static async getUnreadMessagesCount(userId: string) {
    try {
      const unreadCount = await DirectMessage.getUnreadCount(userId);
      return unreadCount;
    } catch (error) {
      throw new Error("Failed to get unread messages count");
    }
  }

  // Mark messages as read
  static async markMessagesAsRead(receiverId: string, senderId: string) {
    try {
      await DirectMessage.markMessagesReadUsingProc(receiverId, senderId);
      return true;
    } catch (error) {
      throw new Error("Failed to mark messages as read");
    }
  }

  // Get latest conversations for a user
  static async getLatestConversations(userId: string) {
    try {
      const latestMessages = await DirectMessage.getLatestMessages();
      return latestMessages.filter(
        (msg) =>
          msg.sender_id === parseInt(userId) ||
          msg.receiver_id === parseInt(userId)
      );
    } catch (error) {
      throw new Error("Failed to fetch latest conversations");
    }
  }

  // Delete a message
  static async deleteMessage(messageId: number, userId: number) {
    try {
      const message = await DirectMessage.findByPk(messageId);
      if (!message || message.senderId !== userId) {
        throw new Error("Unauthorized to delete this message");
      }
      await message.destroy();
      return true;
    } catch (error) {
      throw new Error("Failed to delete message");
    }
  }

  // Search messages in conversation
  static async searchMessages(userId: string, searchTerm: string) {
    try {
      const messages = await DirectMessage.findAll({
        where: {
          [Op.or]: [{ senderId: userId }, { receiverId: userId }],
          content: {
            [Op.like]: `%${searchTerm}%`,
          },
        },
        order: [["createdAt", "DESC"]],
        limit: 50,
      });
      return messages;
    } catch (error) {
      throw new Error("Failed to search messages");
    }
  }
}
