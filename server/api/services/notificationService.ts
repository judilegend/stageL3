import webpush from "web-push";
import Subscription from "../models/subscription";

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

class NotificationService {
  async saveSubscription(
    userId: number,
    subscription: webpush.PushSubscription
  ) {
    const { endpoint, keys } = subscription;

    return await Subscription.create({
      userId,
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
    });
  }

  async sendNotification(userId: number, payload: any) {
    const subscriptions = await Subscription.findAll({
      where: { userId },
    });

    const notifications = subscriptions.map((sub) => {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth,
        },
      };

      return webpush.sendNotification(
        pushSubscription,
        JSON.stringify(payload)
      );
    });

    return Promise.all(notifications);
  }

  async removeSubscription(endpoint: string) {
    return await Subscription.destroy({
      where: { endpoint },
    });
  }
}

export default new NotificationService();
