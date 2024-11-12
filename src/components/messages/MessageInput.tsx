import React, { useState, useRef } from "react";
import { useMessages } from "@/contexts/MessageContext";
import { Paperclip, Send } from "lucide-react";

export const MessageInput = () => {
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { sendMessage, selectedConversation } = useMessages();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && selectedConversation) {
      await sendMessage(selectedConversation, message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedConversation) {
      setIsUploading(true);
      // Implement your file upload logic here
      setIsUploading(false);
    }
  };

  return (
    <div className="border-t bg-white p-4">
      <form onSubmit={handleSubmit} className="flex items-center space-x-4">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-gray-500 hover:text-blue-500 transition"
          disabled={isUploading}
        >
          <Paperclip className="h-5 w-5" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx"
        />
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 rounded-full border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
          disabled={!selectedConversation || isUploading}
        />
        <button
          type="submit"
          disabled={!selectedConversation || !message.trim() || isUploading}
          className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};
