import { Router } from "express";
import notificationController from "../controllers/notificationController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

// Subscribe to push notifications
router.post("/subscribe", authenticate, notificationController.subscribe);

// Get all notifications for current user
router.get("/", authenticate, notificationController.getNotifications);

// Get unread notifications count
router.get(
  "/unread-count",
  authenticate,
  notificationController.getUnreadCount
);

// Mark notification as read
router.put(
  "/:notificationId/read",
  authenticate,
  notificationController.markAsRead
);

// Task assignment notification
router.post(
  "/task-assigned",
  authenticate,
  notificationController.notifyTaskAssignment
);

export default router;
