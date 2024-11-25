import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/contexts/AuthContext";
import Cookies from "js-cookie";

interface Notification {
  id: string;
  title: string;
  body: string;
  timestamp: Date;
  read: boolean;
  data?: {
    type: string;
    taskId?: number;
    url?: string;
  };
}

export const useNotificationSocket = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const token = Cookies.get("token");
    if (!token) return;

    const socket = io(
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
      {
        auth: { token },
        withCredentials: true,
      }
    );

    socket.on("connect", () => {
      console.log("Connected to notification socket");
      // Fetch initial notifications
      fetchNotifications();
    });

    socket.on(
      "taskAssigned",
      (data: { notification: Notification; unreadCount: number }) => {
        // Play notification sound
        const audio = new Audio("./patien.mp3");
        audio.play().catch((e) => console.log("Audio play failed:", e));

        // Update notifications state
        setNotifications((prev) => [data.notification, ...prev]);
        setUnreadCount(data.unreadCount);

        // Show browser notification
        if (Notification.permission === "granted") {
          new Notification(data.notification.title, {
            body: data.notification.body,
            icon: "/icons/icon-192x192.png",
            data: data.notification.data,
          });
        }
      }
    );

    socket.on("notificationRead", ({ notificationId, unreadCount }) => {
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount(unreadCount);
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/notifications`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setNotifications(data);
      setUnreadCount(data.filter((n: Notification) => !n.read).length);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch(
        `http://localhost:5000/api/notifications/${notificationId}/read`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  return { notifications, unreadCount, markAsRead };
};
