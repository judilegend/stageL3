import { useState, useEffect } from "react";
import { NotificationService } from "@/services/notificationService";

export function useNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const checkSupport = () => {
      setIsSupported(
        "Notification" in window &&
          "serviceWorker" in navigator &&
          "PushManager" in window
      );
    };
    checkSupport();
  }, []);

  const subscribe = async () => {
    try {
      const hasPermission = await NotificationService.requestPermission();
      if (hasPermission) {
        await NotificationService.registerPushNotifications();
        setIsSubscribed(true);
      }
    } catch (error) {
      console.error("Erreur de souscription:", error);
    }
  };

  return {
    isSupported,
    isSubscribed,
    subscribe,
  };
}
