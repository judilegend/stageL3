import React, { useState, useRef } from "react";
import { useMessages } from "@/contexts/MessageContext";
import { Paperclip, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const MessageInput = () => {
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    sendMessage,
    sendGroupMessage,
    selectedUser,
    selectedRoom,
    isGroupChat,
  } = useMessages();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (isGroupChat && selectedRoom) {
      await sendGroupMessage(selectedRoom.id, message);
    } else if (selectedUser) {
      await sendMessage(selectedUser.id, message);
    }
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      // Implement file upload logic here
      setIsUploading(false);
    }
  };

  if (!selectedUser && !selectedRoom) return null;

  return (
    <div className="border-t bg-white p-4">
      <form onSubmit={handleSubmit} className="flex items-end space-x-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Paperclip className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Attach file</TooltipContent>
        </Tooltip>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx"
        />

        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 min-h-[20px] max-h-[120px] resize-none"
          disabled={isUploading}
          rows={1}
        />

        <Button
          type="submit"
          size="icon"
          disabled={!message.trim() || isUploading}
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
};
