import { Request, Response } from "express";
import { MessageService } from "../services/messageService";
// Define custom Request type with user
interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    username: string;
    email: string;
    role: "user" | "admin" | "client";
    is_online: boolean;
  };
}
export const messageController = {
  // Get conversation
  async getConversation(req: AuthenticatedRequest, res: Response) {
    try {
      const { userId } = req.params;
      const currentUserId = req.user.id;
      const { limit = 50, offset = 0 } = req.query;

      const messages = await MessageService.getConversation(
        currentUserId.toString(),
        userId,
        Number(limit),
        Number(offset)
      );

      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  // Send message
  async sendMessage(req: AuthenticatedRequest, res: Response) {
    try {
      const { receiverId, content } = req.body;
      const senderId = req.user?.id;

      console.log("Auth check:", {
        headers: req.headers,
        user: req.user,
        senderId,
      });

      if (!senderId || !receiverId || !content?.trim()) {
        console.log("Validation failed:", { senderId, receiverId, content });
        return res.status(400).json({ error: "Missing required fields" });
      }

      const message = await MessageService.sendDirectMessage(
        Number(senderId),
        Number(receiverId),
        content.trim()
      );

      console.log("Message created:", message);
      res.json(message);
    } catch (error) {
      console.error("Send message error:", error);
      res.status(500).json({ error: error.message });
    }
  },
  // Get unread count
  async getUnreadCount(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user.id;
      const unreadCount = await MessageService.getUnreadMessagesCount(
        userId.toString()
      );
      res.json(unreadCount);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Mark messages as read
  async markMessagesRead(req: AuthenticatedRequest, res: Response) {
    try {
      const { senderId } = req.params;
      const receiverId = req.user.id;

      await MessageService.markMessagesAsRead(receiverId.toString(), senderId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get latest conversations
  async getLatestConversations(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user.id;
      const conversations = await MessageService.getLatestConversations(
        userId.toString()
      );
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Delete message
  async deleteMessage(req: AuthenticatedRequest, res: Response) {
    try {
      const { messageId } = req.params;
      const userId = req.user.id;

      await MessageService.deleteMessage(Number(messageId), userId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Search messages
  async searchMessages(req: AuthenticatedRequest, res: Response) {
    try {
      const { searchTerm } = req.query;
      const userId = req.user.id;

      const messages = await MessageService.searchMessages(
        userId.toString(),
        String(searchTerm)
      );
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
