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

      const savedSubscription = await notificationService.saveSubscription(
        userId,
        subscription
      );
      res.status(201).json({
        message: "Subscription saved",
        subscription: savedSubscription,
      });
    } catch (error) {
      console.error("Subscription error:", error);
      res.status(500).json({ error: "Subscription failed" });
    }
  }

  //get notification fonction

  async getNotifications(
    req: Request & { user?: { id: number } },
    res: Response
  ) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Non authentifié" });
      }

      const notifications = await notificationService.getNotifications(userId);
      res.json(notifications);
    } catch (error) {
      console.error("Error in getNotifications:", error);
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  }

  async notifyTaskAssignment(
    req: Request & { user?: { id: number } },
    res: Response
  ) {
    try {
      const { userId, taskTitle, taskId } = req.body;

      await notificationService.notifyTaskAssignment(userId, {
        title: taskTitle,
        id: taskId,
        assignedBy: req.user?.id,
      });

      res.status(200).json({ message: "Notification envoyée" });
    } catch (error) {
      console.error("Task assignment notification error:", error);
      res.status(500).json({ error: "Échec de l'envoi de la notification" });
    }
  }

  async getUnreadCount(
    req: Request & { user?: { id: number } },
    res: Response
  ) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Non authentifié" });
      }

      const count = await notificationService.getUnreadNotificationsCount(
        userId
      );
      res.json({ count });
    } catch (error) {
      res.status(500).json({ error: "Failed to get unread count" });
    }
  }

  async markAsRead(req: Request & { user?: { id: number } }, res: Response) {
    try {
      const { notificationId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Non authentifié" });
      }

      await notificationService.markNotificationAsRead(userId, notificationId);
      res.json({ message: "Notification marked as read" });
    } catch (error) {
      res.status(500).json({ error: "Failed to mark notification as read" });
    }
  }
}

export default new NotificationController();
