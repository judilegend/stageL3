import { Request, Response } from "express";
import notificationService from "../services/notificationService";

class NotificationController {
  async subscribe(req: Request & { user?: { id: number } }, res: Response) {
    try {
      const subscription = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Non authentifié" });
      }

      await notificationService.saveSubscription(userId, subscription);
      res.status(201).json({ message: "Subscription saved" });
    } catch (error) {
      console.error("Subscription error:", error);
      res.status(500).json({ error: "Subscription failed" });
    }
  }

  async unsubscribe(req: Request, res: Response) {
    try {
      const { endpoint } = req.body;
      await notificationService.removeSubscription(endpoint);
      res.json({ message: "Subscription removed" });
    } catch (error) {
      res.status(500).json({ error: "Unsubscribe failed" });
    }
  }
  // Add this method to your existing NotificationController
  async testNotification(
    req: Request & { user?: { id: number } },
    res: Response
  ) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Non authentifié" });
      }

      await notificationService.sendNotification(userId, {
        title: "Test Notification",
        body: "Cette notification confirme que tout fonctionne correctement!",
        icon: "/icons/icon-192x192.png",
      });

      res.json({ message: "Notification test envoyée" });
    } catch (error) {
      console.error("Test notification error:", error);
      res.status(500).json({ error: "Failed to send test notification" });
    }
  }
}

export default new NotificationController();
