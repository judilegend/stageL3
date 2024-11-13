import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";

interface User {
  id: number;
  username: string;
  is_online: boolean;
}

interface Message {
  id: number;
  content: string;
  sender_id: number;
  receiver_id: number;
  createdAt: string;
  read: boolean;
  sender: {
    username: string;
  };
}

interface Room {
  id: number;
  name: string;
  created_by: number;
  creator: {
    id: number;
    username: string;
  };
  members: {
    id: number;
    username: string;
  }[];
}

interface GroupMessage {
  id: number;
  content: string;
  room_id: number;
  sender_id: number;
  createdAt: string;
  sender: {
    id: number;
    username: string;
  };
}

interface MessageContextType {
  // Direct Messages
  messages: Message[];
  sendMessage: (receiverId: number, content: string) => Promise<void>;
  selectedConversation: number | null;
  setSelectedConversation: (userId: number | null) => void;
  loadConversation: (userId: number) => Promise<void>;
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
  unreadCounts: { [key: number]: number };
  markMessagesAsRead: (senderId: number) => Promise<void>;
  loadUnreadCounts: () => Promise<void>;
  onlineUsers: number[];

  // Group Messages
  rooms: Room[];
  selectedRoom: Room | null;
  groupMessages: GroupMessage[];
  setSelectedRoom: (room: Room | null) => void;
  createRoom: (name: string, members: number[]) => Promise<void>;
  sendGroupMessage: (roomId: number, content: string) => Promise<void>;
  loadRoomMessages: (roomId: number) => Promise<void>;
  loadUserRooms: () => Promise<void>;
  isGroupChat: boolean;
  setIsGroupChat: (value: boolean) => void;
  unreadGroupCounts: { [key: number]: number };
  markGroupMessagesAsRead: (roomId: number) => Promise<void>;
  loadUnreadGroupCounts: () => Promise<void>;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export function MessageProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { token } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);

  // Direct Message States
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<
    number | null
  >(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [unreadCounts, setUnreadCounts] = useState<{ [key: number]: number }>(
    {}
  );

  // Group Message States
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [groupMessages, setGroupMessages] = useState<GroupMessage[]>([]);
  const [isGroupChat, setIsGroupChat] = useState(false);
  const [unreadGroupCounts, setUnreadGroupCounts] = useState<{
    [key: number]: number;
  }>({});

  // Add this to the socket event listeners
  useEffect(() => {
    if (socket) {
      socket.on("room_created", (newRoom: Room) => {
        setRooms((prev) => [...prev, newRoom]);
      });

      socket.on("added_to_room", (room: Room) => {
        setRooms((prev) => [...prev, room]);
      });

      return () => {
        socket.off("room_created");
        socket.off("added_to_room");
      };
    }
  }, [socket]);

  useEffect(() => {
    if (token) {
      loadUnreadCounts();
      // loadUnreadGroupCounts();
      loadUserRooms();
      const newSocket = io("http://localhost:5000", {
        auth: { token },
      });
      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [token]);

  useEffect(() => {
    if (socket) {
      socket.on("user_status_change", ({ userId, isOnline }) => {
        setOnlineUsers((prev) =>
          isOnline ? [...prev, userId] : prev.filter((id) => id !== userId)
        );
      });

      socket.on("online_users", (onlineUserIds: number[]) => {
        setOnlineUsers(onlineUserIds);
      });

      // Direct Message Handlers
      socket.on("new_message", (message: Message) => {
        setMessages((prev) => [...prev, message]);
        loadUnreadCounts();
      });

      socket.on("messages_read", () => {
        loadUnreadCounts();
      });

      // Group Message Handlers
      socket.on("new_group_message", (message: GroupMessage) => {
        if (selectedRoom?.id === message.room_id) {
          setGroupMessages((prev) => [...prev, message]);
        }
        loadUnreadGroupCounts();
      });

      socket.on("room_created", (room: Room) => {
        setRooms((prev) => [...prev, room]);
      });

      socket.on("group_messages_read", ({ roomId }) => {
        loadUnreadGroupCounts();
      });

      return () => {
        socket.off("user_status_change");
        socket.off("online_users");
        socket.off("new_message");
        socket.off("messages_read");
        socket.off("new_group_message");
        socket.off("room_created");
        socket.off("group_messages_read");
      };
    }
  }, [socket, selectedRoom]);

  // Direct Message Functions
  const loadUnreadCounts = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/messages/unread-count",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setUnreadCounts(data);
    } catch (error) {
      console.error("Failed to load unread counts:", error);
    }
  };

  const markMessagesAsRead = async (senderId: number) => {
    try {
      await fetch(`http://localhost:5000/api/messages/mark-read/${senderId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      await loadUnreadCounts();
    } catch (error) {
      console.error("Failed to mark messages as read:", error);
    }
  };

  const sendMessage = async (receiverId: number, content: string) => {
    try {
      await fetch("http://localhost:5000/api/messages/direct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ receiverId, content }),
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const loadConversation = async (userId: number) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/messages/conversation/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Failed to load conversation:", error);
    }
  };

  // Group Message Functions
  const loadUnreadGroupCounts = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/groups/rooms/unread-count",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setUnreadGroupCounts(data);
    } catch (error) {
      console.error("Failed to load unread group counts:", error);
    }
  };

  const markGroupMessagesAsRead = async (roomId: number) => {
    try {
      await fetch(
        `http://localhost:5000/api/groups/rooms/${roomId}/mark-read`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await loadUnreadGroupCounts();
    } catch (error) {
      console.error("Failed to mark group messages as read:", error);
    }
  };

  const createRoom = async (name: string, members: number[]) => {
    try {
      const response = await fetch("http://localhost:5000/api/groups/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, members }),
      });
      const room = await response.json();
      setRooms((prev) => [...prev, room]);
    } catch (error) {
      console.error("Failed to create room:", error);
    }
  };

  const loadUserRooms = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/groups/rooms", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to load rooms");
      }

      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error("Failed to load rooms:", error);
      // Optionally handle the error in the UI
    }
  };

  const loadRoomMessages = async (roomId: number) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/groups/rooms/${roomId}/messages`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setGroupMessages(data);
    } catch (error) {
      console.error("Failed to load room messages:", error);
    }
  };

  const sendGroupMessage = async (roomId: number, content: string) => {
    try {
      await fetch(`http://localhost:5000/api/groups/rooms/${roomId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });
    } catch (error) {
      console.error("Failed to send group message:", error);
    }
  };

  const handleSelectUser = (user: User | null) => {
    setSelectedUser(user);
    setSelectedRoom(null);
    setIsGroupChat(false);
    if (user) {
      setSelectedConversation(user.id);
      loadConversation(user.id);
      markMessagesAsRead(user.id);
    }
  };

  const handleSelectRoom = (room: Room | null) => {
    setSelectedRoom(room);
    setSelectedUser(null);
    setIsGroupChat(true);
    if (room) {
      loadRoomMessages(room.id);
      markGroupMessagesAsRead(room.id);
    }
  };

  return (
    <MessageContext.Provider
      value={{
        // Direct Message Values
        messages,
        sendMessage,
        selectedConversation,
        setSelectedConversation,
        loadConversation,
        selectedUser,
        unreadCounts,
        markMessagesAsRead,
        loadUnreadCounts,
        setSelectedUser: handleSelectUser,
        onlineUsers,

        // Group Message Values
        rooms,
        selectedRoom,
        groupMessages,
        setSelectedRoom: handleSelectRoom,
        createRoom,
        sendGroupMessage,
        loadRoomMessages,
        loadUserRooms,
        isGroupChat,
        setIsGroupChat,
        unreadGroupCounts,
        markGroupMessagesAsRead,
        loadUnreadGroupCounts,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
}

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessages must be used within a MessageProvider");
  }
  return context;
};
