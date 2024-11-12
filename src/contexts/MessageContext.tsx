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

interface MessageContextType {
  messages: Message[];
  sendMessage: (receiverId: number, content: string) => Promise<void>;
  selectedConversation: number | null;
  setSelectedConversation: (userId: number | null) => void;
  loadConversation: (userId: number) => Promise<void>;
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export function MessageProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<
    number | null
  >(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
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
      socket.on("new_message", (message: Message) => {
        setMessages((prev) => [...prev, message]);
      });
    }
  }, [socket]);

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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Failed to load conversation:", error);
    }
  };

  const handleSelectUser = (user: User | null) => {
    setSelectedUser(user);
    if (user) {
      setSelectedConversation(user.id);
      loadConversation(user.id);
    }
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
        setSelectedUser: handleSelectUser,
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
