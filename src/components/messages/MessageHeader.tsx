import React from "react";
import { useMessages } from "@/contexts/MessageContext";
import { Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const MessageHeader = () => {
  const { selectedUser, selectedRoom, isGroupChat } = useMessages();

  if (!selectedUser && !selectedRoom) {
    return (
      <div className="border-b p-4 bg-white">
        <p className="text-gray-500">
          Select a conversation to start messaging
        </p>
      </div>
    );
  }

  return (
    <div className="border-b p-4 bg-white">
      <div className="flex items-center space-x-4">
        {isGroupChat ? (
          <>
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  <Users className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h3 className="font-semibold">{selectedRoom?.name}</h3>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-sm text-gray-500">
                    {selectedRoom?.members?.length} members
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-1">
                    {selectedRoom?.members?.map((member) => (
                      <p key={member.id}>{member.username}</p>
                    )) || "No members"}
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          </>
        ) : (
          <>
            <Avatar className="h-10 w-10">
              <AvatarFallback>
                {selectedUser?.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{selectedUser?.username}</h3>
              <span
                className={`text-sm ${
                  selectedUser?.is_online ? "text-green-500" : "text-gray-500"
                }`}
              >
                {selectedUser?.is_online ? "Online" : "Offline"}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
