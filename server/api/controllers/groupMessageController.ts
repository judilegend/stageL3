import { Request, Response } from "express";
import groupMessageService from "../services/groupMessageService";
import sequelize from "../config/database";
import User from "../models/user";
import { Room } from "../models/groupMessage";

class GroupMessageController {
  async createRoom(req: Request & { user?: { id: string } }, res: Response) {
    try {
      const { name, members } = req.body;

      // Validation
      if (!name || !members || !Array.isArray(members)) {
        return res.status(400).json({
          error: "Invalid request body. Name and members array are required",
        });
      }

      const createdBy = parseInt(req.user?.id!);

      // Create room and add members in a transaction
      const room = await sequelize.transaction(async (t) => {
        const newRoom = await groupMessageService.createRoom(name, createdBy);
        if (newRoom) {
          await groupMessageService.addMembersToRoom(
            newRoom.id,
            [...new Set([...members, createdBy])] // Remove duplicates
          );
          return newRoom;
        }
        throw new Error("Failed to create room");
      });

      // Return room with full details
      const roomWithDetails = await Room.findByPk(room.id, {
        include: [
          {
            model: User,
            as: "members",
            attributes: ["id", "username"],
            through: { attributes: [] },
          },
          {
            model: User,
            as: "creator",
            attributes: ["id", "username"],
          },
        ],
      });

      return res.status(201).json(roomWithDetails);
    } catch (error: unknown) {
      console.error("Create room error:", error);
      return res.status(500).json({
        error: "Failed to create room",
        details:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? error.message
            : undefined,
      });
    }
  }
  async getUserRooms(req: Request & { user?: { id: string } }, res: Response) {
    try {
      const userId = parseInt(req.user?.id!);
      const rooms = await groupMessageService.getUserRooms(userId);
      res.status(200).json(rooms);
    } catch (error: unknown) {
      console.error("Error in getUserRooms controller:", error);
      res.status(500).json({
        error: "Failed to fetch user rooms",
        details:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? error.message
            : undefined,
      });
    }
  }
  // async getRoomDetails(req: Request, res: Response) {
  //   try {
  //     const { roomId } = req.params;
  //     const room = await groupMessageService.getRoomDetails(parseInt(roomId));
  //     res.status(200).json(room);
  //   } catch (error) {
  //     res.status(500).json({ error: "Failed to fetch room details" });
  //   }
  // }

  async getRoomDetails(req: Request, res: Response) {
    try {
      const { roomId } = req.params;
      const room = await groupMessageService.getRoomDetails(parseInt(roomId));
      res.status(200).json(room);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch room details" });
    }
  }

  async sendGroupMessage(
    req: Request & { user?: { id: string }; file?: any },
    res: Response
  ) {
    try {
      const { roomId } = req.params;
      const { content } = req.body;
      const senderId = parseInt(req.user?.id!);

      const message = await groupMessageService.sendGroupMessage(
        parseInt(roomId),
        senderId,
        content,
        req.file
      );

      res.status(201).json(message);
    } catch (error) {
      console.error("Error sending group message:", error);
      res.status(500).json({ error: "Failed to send group message" });
    }
  }

  async getUnreadGroupMessagesCount(
    req: Request & { user?: { id: string } },
    res: Response
  ) {
    try {
      const userId = parseInt(req.user?.id!);
      const unreadCounts =
        await groupMessageService.getUnreadGroupMessagesCount(userId);
      res.status(200).json(unreadCounts);
    } catch (error) {
      console.error("Error getting unread counts:", error);
      res.status(500).json({
        error: "Failed to fetch unread counts",
        details:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? error.message
            : undefined,
      });
    }
  }
  async markGroupMessagesAsRead(
    req: Request & { user?: { id: string } },
    res: Response
  ) {
    try {
      const { roomId } = req.params;
      const userId = parseInt(req.user?.id!);
      await groupMessageService.markGroupMessagesAsRead(
        parseInt(roomId),
        userId
      );
      res.status(200).json({ message: "Messages marked as read" });
    } catch (error) {
      res.status(500).json({ error: "Failed to mark messages as read" });
    }
  }

  async addMembersToRoom(req: Request, res: Response) {
    try {
      const { roomId } = req.params;
      const { members } = req.body;
      await groupMessageService.addMembersToRoom(parseInt(roomId), members);
      res.status(200).json({ message: "Members added successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to add members" });
    }
  }
  async getRoomMessages(req: Request, res: Response) {
    try {
      const { roomId } = req.params;
      const messages = await groupMessageService.getRoomMessages(
        parseInt(roomId)
      );
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch room messages" });
    }
  }

  async removeUserFromRoom(req: Request, res: Response) {
    try {
      const { roomId, userId } = req.params;
      await groupMessageService.removeUserFromRoom(
        parseInt(roomId),
        parseInt(userId)
      );
      res.status(200).json({ message: "Member removed successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to remove member" });
    }
  }

  async deleteRoom(req: Request, res: Response) {
    try {
      const { roomId } = req.params;
      await groupMessageService.deleteRoom(parseInt(roomId));
      res.status(200).json({ message: "Room deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete room" });
    }
  }
}

export default new GroupMessageController();
