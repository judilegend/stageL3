"use client";
import React from "react";
import { MessageProvider, useMessages } from "@/contexts/MessageContext";
import { UserList } from "@/components/messages/UserList";
import { MessageList } from "@/components/messages/MessageList";
import { MessageInput } from "@/components/messages/MessageInput";
import { MessageHeader } from "@/components/messages/MessageHeader";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MessagesPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-600">Please login to access messages</p>
      </div>
    );
  }

  return (
    <MessageProvider>
      <MessagesContent userId={user.id} />
    </MessageProvider>
  );
}

function MessagesContent({ userId }: { userId: number }) {
  const { isGroupChat } = useMessages();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden h-[700px]">
        <div className="flex h-full">
          <UserList currentUserId={userId} />
          <div className="flex-1 flex flex-col">
            <MessageHeader />
            <div className="flex-1 overflow-hidden flex flex-col">
              <MessageList />
              <MessageInput />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
