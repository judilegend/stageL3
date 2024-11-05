import { Server, Socket } from "socket.io";
import { verifyToken } from "../middleware/authMiddleware";
import DirectMessage from "../models/direct_message";
export const setupSocketServer = (io: Server) => {
  // Middleware for authentication
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

    // Join personal room
    socket.join(`user:${userId}`);

    // Handle direct messages
    socket.on(
      "direct_message",
      async (data: { receiverId: number; content: string }) => {
        try {
          // Save message to database using DirectMessage model
          const message = await DirectMessage.create({
            senderId: userId,
            receiverId: data.receiverId,
            content: data.content,
          });

          // Emit to sender and receiver
          io.to(`user:${userId}`)
            .to(`user:${data.receiverId}`)
            .emit("new_message", {
              ...message.toJSON(),
              sender: userId,
            });
        } catch (error) {
          socket.emit("error", { message: "Failed to send message" });
        }
      }
    );

    // Join chat room
    socket.on("join_room", (roomId: string) => {
      socket.join(`room:${roomId}`);
    });

    // Leave chat room
    socket.on("leave_room", (roomId: string) => {
      socket.leave(`room:${roomId}`);
    });

    // Handle room messages
    socket.on(
      "room_message",
      async (data: { roomId: string; content: string }) => {
        try {
          io.to(`room:${data.roomId}`).emit("new_room_message", {
            content: data.content,
            sender: userId,
            roomId: data.roomId,
            timestamp: new Date(),
          });
        } catch (error) {
          socket.emit("error", { message: "Failed to send room message" });
        }
      }
    );

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User ${userId} disconnected`);
    });
  });
};
