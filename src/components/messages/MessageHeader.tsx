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
    <div className="border-b p-4 bg-white flex items-center justify-between">
      <div className="flex items-center space-x-4 flex-1 min-w-0">
        {isGroupChat ? (
          <>
            <div className="relative shrink-0">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  <Users className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold truncate">{selectedRoom?.name}</h3>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-sm text-gray-500 truncate">
                    {selectedRoom?.members?.length} members
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {selectedRoom?.members?.map((member) => (
                      <p key={member.id} className="whitespace-nowrap">
                        {member.username}
                      </p>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          </>
        ) : (
          <>
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarFallback>
                {selectedUser?.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h3 className="font-semibold truncate">
                {selectedUser?.username}
              </h3>
              <span
                className={`text-sm inline-flex items-center ${
                  selectedUser?.is_online ? "text-green-500" : "text-gray-500"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full mr-2 ${
                    selectedUser?.is_online ? "bg-green-500" : "bg-gray-500"
                  }`}
                />
                {selectedUser?.is_online ? "Online" : "Offline"}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
