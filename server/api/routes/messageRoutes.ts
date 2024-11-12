import express from "express";
import messageController from "../controllers/messageController";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();

router.use(authenticate);

router.post("/direct", messageController.sendDirectMessage);
router.get("/conversation/:otherUserId", messageController.getConversation);

export default router;
