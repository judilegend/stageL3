import webpush from "web-push";
import { Server } from "socket.io";
import Subscription from "../models/subscription";
import Notification from "../models/notification";
import User from "../models/user";

class NotificationService {
  private io: Server | undefined;

  setSocketIO(io: Server) {
    this.io = io;
  }
  async saveSubscription(
    userId: number,
    subscription: webpush.PushSubscription
  ) {
    try {
      const { endpoint, keys } = subscription;

      const existingSubscription = await Subscription.findOne({
        where: { endpoint },
      });

      if (existingSubscription) {
        return existingSubscription;
      }

      return await Subscription.create({
        userId,
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
      });
    } catch (error) {
      console.error("Save subscription error:", error);
      throw error;
    }
  }

  //get notification

  async getNotifications(userId: number) {
    try {
      const notifications = await Notification.findAll({
        where: { userId },
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: User,
            attributes: ["id", "username"],
          },
        ],
      });

      return notifications;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  }
  async notifyTaskAssignment(userId: number, task: any) {
    try {
      // Create notification title and body based on type
      let title, body;
      switch (task.type) {
        case "TASK_REVIEW":
          title = "Nouvelle tâche à réviser";
          body = `Le développeur a terminé la tâche: ${task.title}. Révision requise.`;
          break;
        case "TASK_APPROVED":
          title = "Tâche approuvée";
          body = `Votre tâche "${task.title}" a été validée!`;
          break;
        case "TASK_REVISION":
          title = "Révision requise";
          body = `La tâche "${task.title}" nécessite des modifications.`;
          break;
        default:
          title = "Nouvelle tâche assignée";
          body = `Vous avez été assigné à la tâche: ${task.title}`;
      }

      const payload = {
        id: Date.now().toString(),
        title,
        body,
        data: {
          ...task.data,
          type: task.type,
          url: `/tasks/${task.id}`,
        },
        icon: "/icons/icon-192x192.png",
        timestamp: new Date(),
        read: false,
      };

      // Save notification to database
      const notification = await Notification.create({
        userId,
        title: payload.title,
        body: payload.body,
        data: payload.data,
        read: false,
      });

      // Get user's push subscriptions
      const subscriptions = await Subscription.findAll({
        where: { userId },
      });

      // Send push notifications
      const pushPromises = subscriptions.map(async (sub) => {
        try {
          const pushSubscription = {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          };

          await webpush.sendNotification(
            pushSubscription,
            JSON.stringify(payload)
          );
        } catch (error) {
          console.error("Push notification failed:", error);
        }
      });

      await Promise.allSettled(pushPromises);

      // Get updated unread count
      const unreadCount = await this.getUnreadNotificationsCount(userId);

      // Emit socket event
      if (this.io) {
        this.io.to(`user:${userId}`).emit("taskAssigned", {
          notification,
          unreadCount,
        });
      }

      return { notification, unreadCount };
    } catch (error) {
      console.error("Notification service error:", error);
      throw error;
    }
  }

  async markNotificationAsRead(
    userId: number,
    notificationId: string
  ): Promise<void> {
    await Notification.update(
      { read: true },
      {
        where: {
          id: notificationId,
          userId,
        },
      }
    );

    // Emit socket event to update UI in real-time
    if (this.io) {
      const unreadCount = await this.getUnreadNotificationsCount(userId);
      this.io.to(`user:${userId}`).emit("notificationRead", {
        notificationId,
        unreadCount,
      });
    }
  }

  async getUnreadNotificationsCount(userId: number): Promise<number> {
    return await Notification.count({
      where: {
        userId,
        read: false,
      },
    });
  }
}

export default new NotificationService();
