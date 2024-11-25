import { useEffect, useState, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/contexts/AuthContext";
import Cookies from "js-cookie";

interface NotificationSound {
  key: string;
  audio: HTMLAudioElement;
}

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
  const socketRef = useRef<Socket>();
  const soundsRef = useRef<Map<string, NotificationSound>>(new Map());

  // Initialisation des sons
  const initializeSounds = useCallback(() => {
    const sounds = [
      {
        key: "TASK_APPROVED",
        path: "/sounds/success.wav",
        volume: 1.0, // Maximum volume
      },
      {
        key: "TASK_REVIEW",
        path: "/sounds/review.wav",
        volume: 1.0, // Maximum volume
      },
      {
        key: "default",
        path: "/sounds/notification.wav",
        volume: 1.0, // Maximum volume
      },
    ];

    sounds.forEach(({ key, path, volume }) => {
      const audio = new Audio(path);
      audio.volume = volume;
      audio.preload = "auto";
      audio.muted = false; // Ensure audio is not muted
      soundsRef.current.set(key, { key, audio });
    });
  }, []);

  const playNotificationSound = useCallback((type: string = "default") => {
    const sound =
      soundsRef.current.get(type) || soundsRef.current.get("default");
    if (sound) {
      sound.audio.currentTime = 0;
      sound.audio.volume = 1.0; // Ensure maximum volume when playing
      // Force play with user interaction
      const playPromise = sound.audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Sound playback failed:", error);
        });
      }
    }
  }, []);

  const handleNotification = useCallback(
    (data: { notification: Notification; unreadCount: number }) => {
      const { notification, unreadCount: newUnreadCount } = data;

      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount(newUnreadCount);

      playNotificationSound(notification.data?.type);

      if (Notification.permission === "granted") {
        const browserNotification = new Notification(notification.title, {
          body: notification.body,
          icon: "/icons/icon-192x192.png",
          tag: `task-${notification.data?.taskId}`,
          silent: true, // Désactiver le son par défaut du navigateur
        });

        browserNotification.onclick = () => {
          window.focus();
          if (notification.data?.url) {
            window.location.href = notification.data.url;
          }
        };
      }
    },
    [playNotificationSound]
  );

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/notifications`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

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
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
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

  useEffect(() => {
    if (!user) return;

    initializeSounds();
    const token = Cookies.get("token");
    if (!token) return;

    socketRef.current = io(
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
      {
        auth: { token },
        withCredentials: true,
      }
    );

    socketRef.current.on("connect", () => {
      console.log("Connected to notification socket");
      fetchNotifications();
    });

    socketRef.current.on("taskAssigned", handleNotification);
    socketRef.current.on("taskStatusChanged", handleNotification);

    return () => {
      soundsRef.current.clear();
      socketRef.current?.disconnect();
    };
  }, [user, handleNotification, initializeSounds]);

  return { notifications, unreadCount, markAsRead };
};
