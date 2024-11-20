import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
// import { sequelize } from "./models/index";
import sequelize from "./config/database";

import { setupSocketServer } from "./socket";
import path from "path";

import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import projectRoutes from "./routes/projectRoutes";
import salleRoutes from "./routes/salleRoute";
import activiteRoutes from "./routes/activiteRoutes";
import pomodoroRoutes from "./routes/pomodoroRoutes";
import workPackageRoutes from "./routes/workpackageRoutes";
import sprintRoutes from "./routes/sprintRoutes";
import tacheRoutes from "./routes/tacheRoutes";
import messageRoutes from "./routes/messageRoutes";
import pieceJointeRoutes from "./routes/pieceJointeRoutes";
import groupMessageRoutes from "./routes/groupMessageRoutes";
//web push

import { initializeWebPush } from "./utils/webPushUtil";
import notificationRoutes from "./routes/notificationRoutes";
import notificationService from "./services/notificationService";

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "X-Requested-With",
      "Accept",
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Headers",
    ],
    exposedHeaders: ["set-cookie"],
  })
);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Authorization"],
  },
});

//initializeWebPush();
initializeWebPush();

app.use(express.json());
// app.use("/images", express.static(path.join(__dirname, "./uploads/images")));
// app.use("/files", express.static(path.join(__dirname, "./uploads/files")));
app.use("/files", express.static(path.join(__dirname, "./uploads/files")));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/tasks", tacheRoutes);
app.use("/api/workpackages", workPackageRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/sprints", sprintRoutes);
app.use("/api/activities", activiteRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/pomodoro", pomodoroRoutes);
app.use("/api/piece-jointes", pieceJointeRoutes);
app.use("/api/groups", groupMessageRoutes);
//call web push rouutes
app.use("/api/notifications", notificationRoutes);

// Pass socket.io instance to notification service
notificationService.setSocketIO(io);

setupSocketServer(io);

const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`WebSocket server initialized`);
  });
});

export { app, io };
