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

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Authorization"],
  },
});

app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "../uploads/images")));

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

setupSocketServer(io);
console.log(
  "Static files served from:",
  path.join(__dirname, "../uploads/images")
);

const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

export { app, io };
