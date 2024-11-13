import React, { useEffect, useState } from "react";
import { useMessages } from "@/contexts/MessageContext";
import { Search, MessageCircle, Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface User {
  id: number;
  username: string;
  is_online: boolean;
}

export const UserList = ({ currentUserId }: { currentUserId: number }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  // const { rooms = [] } = useMessages();

  const {
    setSelectedUser,
    selectedConversation,
    unreadCounts,
    rooms = [],
    setSelectedRoom,
    createRoom,
    isGroupChat,
    setIsGroupChat,
  } = useMessages();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/user", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setUsers(data.filter((user: User) => user.id !== currentUserId));
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateRoom = async () => {
    if (roomName && selectedMembers.length > 0) {
      try {
        // Make sure members is an array of numbers
        const membersArray = selectedMembers.map((id) => Number(id));

        await createRoom(roomName, membersArray);
        setIsCreatingRoom(false);
        setRoomName("");
        setSelectedMembers([]);
      } catch (error) {
        console.error("Error creating room:", error);
      }
    }
  };

  return (
    <div className="w-80 border-r bg-gray-50 flex flex-col h-full">
      <div className="p-4 border-b bg-white space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Messages</h2>
          <Dialog open={isCreatingRoom} onOpenChange={setIsCreatingRoom}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Plus className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Group</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Input
                  placeholder="Group Name"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                />
                <div className="space-y-2">
                  <p className="text-sm font-medium">Select Members:</p>
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedMembers.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedMembers([...selectedMembers, user.id]);
                          } else {
                            setSelectedMembers(
                              selectedMembers.filter((id) => id !== user.id)
                            );
                          }
                        }}
                      />
                      <span>{user.username}</span>
                    </div>
                  ))}
                </div>
                <Button onClick={handleCreateRoom}>Create Group</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs
          defaultValue="direct"
          onValueChange={(value) => setIsGroupChat(value === "groups")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="direct">
              <MessageCircle className="h-4 w-4 mr-2" />
              Direct
            </TabsTrigger>
            <TabsTrigger value="groups">
              <Users className="h-4 w-4 mr-2" />
              Groups
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isGroupChat ? (
          // Group List
          <div className="space-y-1 p-2">
            {Array.isArray(rooms) &&
              rooms.map((room) => (
                <Button
                  key={`room-${room.id}`} // Added unique key
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => setSelectedRoom(room)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium">{room.name}</p>
                      <p className="text-sm text-gray-500">
                        {room.members?.length || 0} members
                      </p>
                    </div>
                  </div>
                </Button>
              ))}
          </div>
        ) : (
          // Direct Messages List
          <div className="space-y-1 p-2">
            {filteredUsers.map((user) => (
              <Button
                key={`user-${user.id}`} // Added unique key
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setSelectedUser(user)}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="font-semibold text-blue-600">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    {unreadCounts[user.id] > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1"
                      >
                        {unreadCounts[user.id]}
                      </Badge>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{user.username}</p>
                    <p className="text-sm text-gray-500">
                      {user.is_online ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
