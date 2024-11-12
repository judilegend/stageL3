"use client";
import React from "react";
import { MessageProvider, useMessages } from "@/contexts/MessageContext";
import { UserList } from "@/components/messages/UserList";
import { MessageList } from "@/components/messages/MessageList";
import { MessageInput } from "@/components/messages/MessageInput";
import { MessageHeader } from "@/components/messages/MessageHeader";
import { useAuth } from "@/contexts/AuthContext";

export default function MessagesPage() {
  const { user } = useAuth();

  if (!user) {
    return <div>Please login to access messages</div>;
  }

  return (
    <MessageProvider>
      <MessagesContent userId={user.id} />
    </MessageProvider>
  );
}

// Create a new component to use the context
function MessagesContent({ userId }: { userId: number }) {
  const { selectedUser } = useMessages();

  return (
    <div className="flex h-[700px] mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
      <UserList currentUserId={userId} />
      <div className="flex-1 flex flex-col">
        <MessageHeader selectedUser={selectedUser} />
        <div className="flex-1 overflow-hidden flex flex-col">
          <MessageList />
          <MessageInput />
        </div>
      </div>
    </div>
  );
}
