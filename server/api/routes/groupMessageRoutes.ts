import express from "express";
import groupMessageController from "../controllers/groupMessageController";
import { authenticate } from "../middleware/authMiddleware";
import { upload } from "../config/multerConfig";

const router = express.Router();

router.use(authenticate);

// Room management
router.post("/rooms", groupMessageController.createRoom);
router.get("/rooms", groupMessageController.getUserRooms);
// router.get("/rooms/:roomId", groupMessageController.getRoomDetails);
router.delete("/rooms/:roomId", groupMessageController.deleteRoom);

// Messages
router.get("/rooms/:roomId/messages", groupMessageController.getRoomMessages);
router.post(
  "/rooms/:roomId/messages",
  upload.single("file"),
  groupMessageController.sendGroupMessage
);
// Unread messages
router.get(
  "/rooms/unread-count",
  groupMessageController.getUnreadGroupMessagesCount
);
router.put(
  "/rooms/:roomId/mark-read",
  groupMessageController.markGroupMessagesAsRead
);

// Members
router.post("/rooms/:roomId/members", groupMessageController.addMembersToRoom);
router.delete(
  "/rooms/:roomId/members/:userId",
  groupMessageController.removeUserFromRoom
);

export default router;
