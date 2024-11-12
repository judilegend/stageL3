import React, { useEffect, useRef } from "react";
import { useMessages } from "@/contexts/MessageContext";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

interface Message {
  id: number;
  content: string;
  sender_id: number;
  receiver_id: number;
  createdAt: string;
  read: boolean;
}

export const MessageList = () => {
  const { messages, selectedUser, markMessagesAsRead, loadConversation } =
    useMessages();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages only when a user is selected
  useEffect(() => {
    if (selectedUser?.id && user?.id) {
      loadConversation(selectedUser.id);
    }
    return () => {
      // Clear messages when component unmounts or user is deselected
      loadConversation(0); // This will clear the messages
    };
  }, [selectedUser?.id, user?.id]);

  // Auto-scroll to latest messages
  useEffect(() => {
    if (selectedUser && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, selectedUser]);

  // Mark messages as read
  useEffect(() => {
    if (selectedUser?.id && messages.length > 0) {
      const hasUnreadMessages = messages.some(
        (message) => !message.read && message.sender_id === selectedUser.id
      );
      if (hasUnreadMessages) {
        markMessagesAsRead(selectedUser.id);
      }
    }
  }, [selectedUser?.id, messages]);

  // Display message to select a user if none is selected
  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <p className="text-lg">👈 Select a conversation to start messaging</p>
        </div>
      </div>
    );
  }

  // Filter messages for the selected conversation only
  const conversationMessages = messages.filter(
    (message: Message) =>
      (message.sender_id === selectedUser.id &&
        message.receiver_id === user?.id) ||
      (message.sender_id === user?.id &&
        message.receiver_id === selectedUser.id)
  );

  // Show empty state for new conversations
  if (conversationMessages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <p className="text-lg">No messages yet</p>
          <p className="text-sm mt-2">
            Start the conversation with {selectedUser.username}!
          </p>
        </div>
      </div>
    );
  }

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    messages.forEach((message) => {
      const date = format(new Date(message.createdAt), "MMMM d, yyyy");
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  const groupedMessages = groupMessagesByDate(conversationMessages);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-8">
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date}>
          <div className="text-center mb-4">
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
              {date}
            </span>
          </div>
          <div className="space-y-4">
            {dateMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender_id === user?.id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.sender_id === user?.id
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-gray-100 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {format(new Date(message.createdAt), "HH:mm")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
