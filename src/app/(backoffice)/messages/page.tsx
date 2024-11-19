"use client";
import React from "react";
import { MessageProvider } from "@/contexts/MessageContext";
import { UserList } from "@/components/messages/UserList";
import { MessageList } from "@/components/messages/MessageList";
import { MessageInput } from "@/components/messages/MessageInput";
import { MessageHeader } from "@/components/messages/MessageHeader";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function MessagesPage() {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleCloseMenu = () => {
    setIsMobileMenuOpen(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-600">Please login to access messages</p>
      </div>
    );
  }

  return (
    <MessageProvider>
      <div className="container z-[-100px] mx-auto p-2 md:p-4 lg:p-8 h-[calc(100vh-6rem)]">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full">
          <div className="flex h-full relative">
            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-5 left-2 md:hidden z-50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* UserList with responsive behavior */}
            <div
              className={`${
                isMobileMenuOpen ? "block" : "hidden"
              } md:block absolute md:relative z-0 h-full md:h-auto w-full md:w-80 bg-white transition-all duration-300 ease-in-out`}
            >
              <UserList
                currentUserId={user.id}
                onUserSelect={handleCloseMenu}
              />
            </div>

            {/* Main chat area */}
            <div className="flex-1 flex flex-col w-full md:w-auto">
              <div className="md:pl-0 pl-14">
                {" "}
                {/* Offset for mobile menu button */}
                <MessageHeader />
              </div>
              <div className="flex-1 overflow-hidden flex flex-col">
                <MessageList />
                <MessageInput />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MessageProvider>
  );
}
