import express, { Request, Response, Router } from "express";
import { messageController } from "../controllers/messageController";
import { authenticate } from "../middleware/authMiddleware";

interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    username: string;
    email: string;
    role: "user" | "admin" | "client";
    is_online: boolean;
  };
}

const router: Router = express.Router();

// router.use(authenticate);

// Get conversation with another user
router.get("/conversation/:userId", (req: Request, res: Response) =>
  messageController.getConversation(req as AuthenticatedRequest, res)
);

// Send a new message
router.post("/send", (req: Request, res: Response) =>
  messageController.sendMessage(req as AuthenticatedRequest, res)
);

// Get unread messages count
router.get("/unread", (req: Request, res: Response) =>
  messageController.getUnreadCount(req as AuthenticatedRequest, res)
);

// Mark messages as read
router.put("/read/:senderId", (req: Request, res: Response) =>
  messageController.markMessagesRead(req as AuthenticatedRequest, res)
);

// Get latest conversations
router.get("/conversations", (req: Request, res: Response) =>
  messageController.getLatestConversations(req as AuthenticatedRequest, res)
);

// Delete a message
router.delete("/:messageId", (req: Request, res: Response) =>
  messageController.deleteMessage(req as AuthenticatedRequest, res)
);

// Search messages
router.get("/search", (req: Request, res: Response) =>
  messageController.searchMessages(req as AuthenticatedRequest, res)
);

export default router;
