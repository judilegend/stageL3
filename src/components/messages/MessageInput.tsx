import React, { useState, useRef } from "react";
import { useMessages } from "@/contexts/MessageContext";
import { Paperclip, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const MessageInput = () => {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    sendMessage,
    sendMessageWithAttachment,
    sendGroupMessage,
    selectedUser,
    selectedRoom,
    sendGroupMessageWithAttachment,
    isGroupChat,
  } = useMessages();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !selectedFile) return;

    if (isGroupChat && selectedRoom) {
      if (selectedFile) {
        await sendGroupMessageWithAttachment(
          selectedRoom.id,
          message,
          selectedFile
        );
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        await sendGroupMessage(selectedRoom.id, message);
      }
    } else if (selectedUser) {
      if (selectedFile) {
        await sendMessageWithAttachment(selectedUser.id, message, selectedFile);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        await sendMessage(selectedUser.id, message);
      }
    }
    setMessage("");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérification de la taille (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        alert("File size should be less than 10MB");
        return;
      }

      // Liste des types de fichiers acceptés
      const allowedTypes = [
        "image/",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/plain",
        "application/zip",
        "application/x-zip-compressed",
      ];

      const isAllowedType = allowedTypes.some((type) =>
        file.type.startsWith(type)
      );

      if (!isAllowedType) {
        alert(
          "File type not supported. Allowed types: images, PDF, DOC, DOCX, XLS, XLSX, TXT, ZIP"
        );
        return;
      }

      setSelectedFile(file);
    }
  };

  const getFilePreview = () => {
    if (!selectedFile) return null;

    if (selectedFile.type.startsWith("image/")) {
      return (
        <img
          src={URL.createObjectURL(selectedFile)}
          alt="Preview"
          className="h-16 w-16 object-cover rounded"
        />
      );
    }

    return (
      <div className="flex items-center space-x-2">
        <div className="bg-gray-200 p-2 rounded">
          <span className="text-sm">{selectedFile.name}</span>
          <span className="text-xs text-gray-500 block">
            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
          </span>
        </div>
      </div>
    );
  };

  const clearFileSelection = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="border-t bg-white p-4">
      <form onSubmit={handleSubmit} className="flex items-end space-x-4">
        <div className="flex-1 space-y-2">
          {selectedFile && (
            <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
              {getFilePreview()}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearFileSelection}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="flex space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Attach file (Images, PDF, DOC, DOCX, XLS, XLSX, TXT, ZIP)
              </TooltipContent>
            </Tooltip>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,image/*"
            />

            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 min-h-[20px] max-h-[120px] resize-none"
              rows={1}
            />
          </div>
        </div>

        <Button
          type="submit"
          size="icon"
          disabled={!message.trim() && !selectedFile}
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
};
