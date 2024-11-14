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
  setGroupMessages: React.Dispatch<React.SetStateAction<GroupMessage[]>>;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export function MessageProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { token } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<
    number | null
  >(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [unreadCounts, setUnreadCounts] = useState<{ [key: number]: number }>(
    {}
  );
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [groupMessages, setGroupMessages] = useState<GroupMessage[]>([]);
  const [isGroupChat, setIsGroupChat] = useState(false);
  const [unreadGroupCounts, setUnreadGroupCounts] = useState<{
    [key: number]: number;
  }>({});

  // Establish socket connection with token authentication
  useEffect(() => {
    if (token) {
      const newSocket = io("http://localhost:5000", { auth: { token } });
      setSocket(newSocket);
      loadInitialData();
      return () => {
        newSocket.close();
      };
    }
  }, [token]);

  const loadInitialData = async () => {
    await Promise.all([
      loadUnreadCounts(),
      loadUnreadGroupCounts(),
      loadUserRooms(),
    ]);
  };

  // Manage socket events for real-time updates

  useEffect(() => {
    if (!socket) return;

    const socketHandlers = {
      user_status_change: ({
        userId,
        isOnline,
      }: {
        userId: number;
        isOnline: boolean;
      }) => {
        setOnlineUsers((prev) =>
          isOnline ? [...prev, userId] : prev.filter((id) => id !== userId)
        );
      },
      online_users: (onlineUserIds: number[]) => {
        setOnlineUsers(onlineUserIds);
      },
      new_message: (message: Message) => {
        setMessages((prev) => [...prev, message]);
        loadUnreadCounts();
      },
      messages_read: () => {
        loadUnreadCounts();
      },
      new_group_message: (message: GroupMessage) => {
        console.log("Received new group message:", message);
        setGroupMessages((prev) => {
          // Always update messages for the current room
          if (selectedRoom?.id === message.room_id) {
            const exists = prev.some((m) => m.id === message.id);
            if (!exists) {
              console.log("Adding new message to current room");
              return [...prev, message].sort(
                (a, b) =>
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime()
              );
            }
          }
          return prev;
        });

        // Update unread counts for other rooms
        if (selectedRoom?.id !== message.room_id) {
          console.log("Updating unread counts for other rooms");
          loadUnreadGroupCounts();
        }
      },
      room_created: (room: Room) => {
        setRooms((prev) => [...prev, room]);
      },
      joined_room: ({ roomId }: { roomId: number }) => {
        if (selectedRoom?.id === roomId) {
          loadRoomMessages(roomId);
        }
      },
    };

    // Register all socket event listeners
    Object.entries(socketHandlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () => {
      // Cleanup all socket event listeners
      Object.keys(socketHandlers).forEach((event) => {
        socket.off(event);
      });
    };
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
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setUnreadGroupCounts(data);
    } catch (error) {
      console.error("Failed to load unread group counts:", error);
      setUnreadGroupCounts({});
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
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error("Failed to load rooms:", error);
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
      setGroupMessages(data || []); // Ensure we always set an array
    } catch (error) {
      console.error("Failed to load room messages:", error);
      setGroupMessages([]); // Set empty array on error
    }
  };

  const sendGroupMessage = async (roomId: number, content: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/groups/rooms/${roomId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content }),
        }
      );
      const newMessage = await response.json();
      setGroupMessages((prev) => [...prev, newMessage]);
      socket?.emit("group_message", { roomId, message: newMessage });
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

  // Room selection handler
  // Handle room selection
  const handleSelectRoom = async (room: Room | null) => {
    if (room) {
      socket?.emit("join_room", room.id);
      await Promise.all([
        loadRoomMessages(room.id),
        markGroupMessagesAsRead(room.id),
      ]);
    }
    setSelectedRoom(room);
    setSelectedUser(null);
    setIsGroupChat(true);
  };

  return (
    <MessageContext.Provider
      value={{
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
        rooms,
        selectedRoom,
        groupMessages,
        setSelectedRoom: handleSelectRoom,
        createRoom,
        sendGroupMessage,
        loadRoomMessages,
        loadUserRooms,
        isGroupChat,
        setGroupMessages,
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
