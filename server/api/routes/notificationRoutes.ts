import { Router } from "express";
import notificationController from "../controllers/notificationController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.post("/subscribe", authenticate, notificationController.subscribe);
router.post("/unsubscribe", authenticate, notificationController.unsubscribe);
// Add this route to your existing routes
router.post("/test", authenticate, notificationController.testNotification);

export default router;
