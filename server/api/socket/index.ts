import { Server, Socket } from "socket.io";
import { verifyToken } from "../middleware/authMiddleware";
import DirectMessage from "../models/message";
import { GroupMessage } from "../models/groupMessage";
import User from "../models/user";

export const setupSocketServer = (io: Server) => {
  io.use(async (socket: Socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        throw new Error("Authentication error");
      }
      const decoded = await verifyToken(token);
      socket.data.userId = decoded.id;
      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const userId = socket.data.userId;
    console.log(`User ${userId} connected`);

    // Join personal room
    socket.join(`user:${userId}`);

    // Handle direct messages
    socket.on(
      "direct_message",
      async (data: { receiverId: number; content: string }) => {
        try {
          const message = await DirectMessage.create({
            senderId: userId,
            receiverId: data.receiverId,
            content: data.content,
          });

          io.to(`user:${userId}`)
            .to(`user:${data.receiverId}`)
            .emit("new_message", message);
        } catch (error) {
          socket.emit("error", { message: "Failed to send message" });
        }
      }
    );

    // Group chat functionality
    socket.on("join_room", (roomId: string) => {
      socket.join(`room:${roomId}`);
      console.log(`User ${userId} joined room ${roomId}`);
    });

    socket.on("leave_room", (roomId: string) => {
      socket.leave(`room:${roomId}`);
      console.log(`User ${userId} left room ${roomId}`);
    });

    socket.on(
      "group_message",
      async (data: { roomId: number; content: string }) => {
        try {
          const message = await GroupMessage.create({
            room_id: data.roomId,
            sender_id: userId,
            content: data.content,
          });

          const messageWithSender = await GroupMessage.findByPk(message.id, {
            include: [
              { model: User, as: "sender", attributes: ["id", "username"] },
            ],
          });

          io.to(`room:${data.roomId}`).emit(
            "new_group_message",
            messageWithSender
          );
        } catch (error) {
          socket.emit("error", { message: "Failed to send group message" });
        }
      }
    );

    // Add notification acknowledgment handler
    socket.on("notification_read", async (notificationId: string) => {
      // Handle notification read status
      console.log(`Notification ${notificationId} read by user ${userId}`);
    });

    socket.on("disconnect", () => {
      console.log(`User ${userId} disconnected`);
    });
  });
};
