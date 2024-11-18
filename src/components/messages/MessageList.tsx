import React, { useEffect, useRef } from "react";
import { useMessages } from "@/contexts/MessageContext";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileIcon } from "lucide-react";

interface Message {
  id: number;
  content: string;
  sender_id: number;
  createdAt: string;
  sender: {
    id: number;
    username: string;
  };
  attachments?: {
    id: number;
    filename: string;
    originalName: string;
    path: string;
    mimetype: string;
    size: number;
  }[];
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, groupMessages]);

  useEffect(() => {
    if (selectedUser && messages.length > 0) {
      const timer = setTimeout(() => {
        markMessagesAsRead(selectedUser.id);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [selectedUser, messages]);

  useEffect(() => {
    if (selectedRoom?.id) {
      loadRoomMessages(selectedRoom.id);
      const timer = setTimeout(() => {
        markGroupMessagesAsRead(selectedRoom.id);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [selectedRoom?.id]);

  const renderAttachment = (
    attachment: NonNullable<Message["attachments"]>[number]
  ) => {
    if (attachment.mimetype.startsWith("image/")) {
      return (
        <img
          src={`http://localhost:5000${attachment.path}`}
          alt={attachment.originalName}
          className="max-w-full rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
          loading="lazy"
          onClick={() =>
            window.open(`http://localhost:5000${attachment.path}`, "_blank")
          }
        />
      );
    }

    return (
      <a
        href={`http://localhost:5000${attachment.path}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-2 bg-gray-100 p-2 rounded hover:bg-gray-200 transition-colors"
      >
        <FileIcon className="h-4 w-4" />
        <span className="text-sm text-blue-600 hover:underline">
          {attachment.originalName}
        </span>
      </a>
    );
  };

  const renderMessage = (message: Message) => {
    const isCurrentUser = message.sender_id === user?.id;

    return (
      <div
        key={message.id}
        className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`max-w-[70%] rounded-lg p-3 ${
            isCurrentUser
              ? "bg-blue-500 text-white rounded-br-none"
              : "bg-gray-100 rounded-bl-none"
          }`}
        >
          {isGroupChat && !isCurrentUser && (
            <p
              className={`text-xs font-medium mb-1 ${
                isCurrentUser ? "text-white" : "text-gray-600"
              }`}
            >
              {message.sender.username}
            </p>
          )}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              Vous
              {message.attachments.map((attachment) => (
                <div key={attachment.id} className="max-w-sm">
                  {renderAttachment(attachment)}
                </div>
              ))}
            </div>
          )}
          {message.content && (
            <p className="text-sm whitespace-pre-wrap break-words">
              {message.content}
            </p>
          )}
          <span
            className={`text-xs ${
              isCurrentUser ? "text-white/70" : "text-gray-500"
            } mt-1 block`}
          >
            {format(new Date(message.createdAt), "HH:mm")}
          </span>
        </div>
      </div>
    );
  };

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

  if (!selectedUser && !selectedRoom) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <p className="text-lg">👈 Select a conversation to start messaging</p>
        </div>
      </div>
    );
  }

  const uniqueMessages = Array.from(
    new Map(
      ((isGroupChat ? groupMessages : messages) || []).map((msg) => [
        msg.id,
        msg,
      ])
    ).values()
  ) as Message[];

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
              {dateMessages.map((message) => renderMessage(message))}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};
