import express from "express";
import messageController from "../controllers/messageController";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();

router.use(authenticate);

router.post("/direct", messageController.sendDirectMessage);
router.get("/conversation/:otherUserId", messageController.getConversation);
router.get("/unread-count", messageController.getUnreadMessagesCount);
router.put("/mark-read/:senderId", messageController.markMessagesAsRead);

export default router;
