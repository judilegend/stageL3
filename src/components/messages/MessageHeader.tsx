import React from "react";
import { useMessages } from "@/contexts/MessageContext";

interface User {
  id: number;
  username: string;
  is_online: boolean;
}

export const MessageHeader = ({
  selectedUser,
}: {
  selectedUser: User | null;
}) => {
  if (!selectedUser) {
    return (
      <div className="border-b p-4 bg-white text-gray-500">
        Select a user to start messaging
      </div>
    );
  }

  return (
    <div className="border-b p-4 bg-white flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-blue-600 font-semibold">
            {selectedUser.username.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h3 className="font-semibold">{selectedUser.username}</h3>
          <span
            className={`text-sm ${
              selectedUser.is_online ? "text-green-500" : "text-gray-500"
            }`}
          >
            {selectedUser.is_online ? "Online" : "Offline"}
          </span>
        </div>
      </div>
    </div>
  );
};
