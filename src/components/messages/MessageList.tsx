import React, { useEffect, useRef } from "react";
import { useMessages } from "@/contexts/MessageContext";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: number;
  content: string;
  sender_id: number;
  createdAt: string;
  sender: {
    id: number;
    username: string;
  };
}

export const MessageList: React.FC = () => {
  const {
    messages,
    selectedUser,
    markMessagesAsRead,
    groupMessages,
    loadRoomMessages,
    selectedRoom,
    isGroupChat,
    markGroupMessagesAsRead,
  } = useMessages();

  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, groupMessages]);

  // Handle direct messages
  useEffect(() => {
    if (selectedUser && messages.length > 0) {
      const timer = setTimeout(() => {
        markMessagesAsRead(selectedUser.id);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [selectedUser, messages]);

  // Handle group messages
  useEffect(() => {
    if (selectedRoom?.id) {
      loadRoomMessages(selectedRoom.id);
      const timer = setTimeout(() => {
        markGroupMessagesAsRead(selectedRoom.id);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [selectedRoom?.id]);

  if (!selectedUser && !selectedRoom) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <p className="text-lg">👈 Select a conversation to start messaging</p>
        </div>
      </div>
    );
  }

  // Use a Set to keep only unique messages by their `id`
  const uniqueMessages = Array.from(
    new Map(
      (isGroupChat ? groupMessages : messages).map((msg) => [msg.id, msg])
    ).values()
  );

  if (uniqueMessages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <p className="text-lg">No messages yet</p>
          <p className="text-sm mt-2">
            Start the conversation with{" "}
            {isGroupChat ? selectedRoom?.name : selectedUser?.username}!
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

  const groupedMessages = groupMessagesByDate(uniqueMessages);

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-8">
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
                    {isGroupChat && message.sender_id !== user?.id && (
                      <p className="text-xs font-medium mb-1 text-gray-600">
                        {message.sender.username}
                      </p>
                    )}
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
    </ScrollArea>
  );
};
