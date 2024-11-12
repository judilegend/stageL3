import { Request, Response } from "express";
import messageService from "../services/messageService";

class MessageController {
  async sendDirectMessage(
    req: Request & { user?: { id: string } },
    res: Response
  ) {
    try {
      const { receiverId, content } = req.body;
      const senderId = req.user?.id;

      if (!senderId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const message = await messageService.createDirectMessage(
        parseInt(senderId),
        parseInt(receiverId),
        content
      );

      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ error: "Failed to send message" });
    }
  }

  async getConversation(
    req: Request & { user?: { id: string } },
    res: Response
  ) {
    try {
      const { otherUserId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const messages = await messageService.getConversation(
        parseInt(userId),
        parseInt(otherUserId)
      );

      res.status(200).json(messages || []);
    } catch (error) {
      console.error("Error fetching conversation:", error);
      res.status(500).json({ error: "Failed to fetch conversation" });
    }
  }
  async getUnreadMessagesCount(
    req: Request & { user?: { id: string } },
    res: Response
  ) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const unreadCounts = await messageService.getUnreadMessagesCount(
        parseInt(userId)
      );
      res.status(200).json(unreadCounts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch unread counts" });
    }
  }

  async markMessagesAsRead(
    req: Request & { user?: { id: string } },
    res: Response
  ) {
    try {
      const { senderId } = req.params;
      const receiverId = req.user?.id;

      if (!receiverId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      await messageService.markMessagesAsRead(
        parseInt(senderId),
        parseInt(receiverId)
      );
      res.status(200).json({ message: "Messages marked as read" });
    } catch (error) {
      res.status(500).json({ error: "Failed to mark messages as read" });
    }
  }
}

export default new MessageController();
