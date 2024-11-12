import React, { useEffect, useState } from "react";
import { useMessages } from "@/contexts/MessageContext";
import { Search, MessageCircle } from "lucide-react";

interface User {
  id: number;
  username: string;
  is_online: boolean;
  last_seen?: string;
}

interface UserListProps {
  currentUserId: number;
}

export const UserList = ({ currentUserId }: UserListProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const {
    setSelectedConversation,
    loadConversation,
    setSelectedUser,
    selectedConversation,
  } = useMessages();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/user", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        const filteredUsers = data.filter(
          (user: User) => user.id !== currentUserId
        );
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [currentUserId]);

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserSelect = (user: User) => {
    setSelectedUser(user); // Pass the full user object
    setSelectedConversation(user.id);
    loadConversation(user.id);
  };

  return (
    <div className="w-80 border-r bg-gray-50 flex flex-col h-full">
      <div className="p-4 border-b bg-white">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="h-6 w-6 text-blue-500" />
          <h2 className="text-xl font-semibold">Messages</h2>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search contacts..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredUsers.length === 0 && !isLoading && (
              <div className="text-center py-4 text-gray-500">
                {searchTerm ? "No users found" : "No contacts available"}
              </div>
            )}
            {filteredUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => handleUserSelect(user)}
                className={`w-full text-left p-3 rounded-lg transition flex items-center space-x-3 ${
                  selectedConversation === user.id
                    ? "bg-blue-50 text-blue-600"
                    : "hover:bg-gray-100"
                }`}
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="font-semibold text-blue-600">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{user.username}</span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        user.is_online ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                  </div>
                  {!user.is_online && user.last_seen && (
                    <p className="text-sm text-gray-500">
                      Last seen: {new Date(user.last_seen).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
