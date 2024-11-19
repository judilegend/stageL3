import React, { useEffect, useCallback, useMemo } from "react";
import { useMessages } from "@/contexts/MessageContext";
import { Search, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useDebounce } from "@/hooks/useDebounce";

interface User {
  id: number;
  username: string;
  is_online: boolean;
}

interface UserListProps {
  currentUserId: number;
  onUserSelect?: () => void;
}

const UserAvatar = ({
  username,
  isOnline,
  unreadCount,
}: {
  username: string;
  isOnline: boolean;
  unreadCount?: number;
}) => (
  <div className="relative">
    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
      <span className="font-semibold text-blue-600">
        {username.charAt(0).toUpperCase()}
      </span>
    </div>
    <div
      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
        isOnline ? "bg-green-500" : "bg-gray-400"
      } transition-colors duration-200`}
    />
    {unreadCount !== undefined && unreadCount > 0 && (
      <Badge
        variant="destructive"
        className="absolute -top-1 -right-1 animate-pulse"
      >
        {unreadCount}
      </Badge>
    )}
  </div>
);

const GroupAvatar = ({
  name,
  unreadCount,
}: {
  name: string;
  unreadCount?: number;
}) => (
  <div className="relative">
    <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center">
      <Users className="h-5 w-5 text-violet-600" />
    </div>
    {unreadCount !== undefined && unreadCount > 0 && (
      <Badge
        variant="destructive"
        className="absolute -top-1 -right-1 animate-pulse"
      >
        {unreadCount}
      </Badge>
    )}
  </div>
);

export const UserList = ({ currentUserId, onUserSelect }: UserListProps) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isCreatingRoom, setIsCreatingRoom] = React.useState(false);
  const [roomName, setRoomName] = React.useState("");
  const [selectedMembers, setSelectedMembers] = React.useState<number[]>([]);
  const [users, setUsers] = React.useState<User[]>([]);

  const debouncedSearch = useDebounce(searchTerm, 300);

  const {
    setSelectedUser,
    unreadCounts,
    unreadGroupCounts,
    rooms = [],
    setSelectedRoom,
    createRoom,
    loadRoomMessages,
    loadUnreadGroupCounts,
    markGroupMessagesAsRead,
    loadUserRooms,
    selectedRoom,
  } = useMessages();

  const fetchUsers = useCallback(async () => {
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
  }, [currentUserId]);

  useEffect(() => {
    fetchUsers();
    if (!selectedRoom) {
      loadUnreadGroupCounts();
    }
  }, [fetchUsers, selectedRoom, loadUnreadGroupCounts]);

  const filteredUsers = useMemo(
    () =>
      users.filter((user) =>
        user.username.toLowerCase().includes(debouncedSearch.toLowerCase())
      ),
    [users, debouncedSearch]
  );

  const filteredRooms = useMemo(
    () =>
      rooms.filter((room) =>
        room.name?.toLowerCase().includes(debouncedSearch.toLowerCase())
      ),
    [rooms, debouncedSearch]
  );

  const handleUserSelect = useCallback(
    (user: User) => {
      setSelectedUser(user);
      onUserSelect?.();
    },
    [setSelectedUser, onUserSelect]
  );

  const handleRoomSelect = useCallback(
    (room) => {
      setSelectedRoom(room);
      loadRoomMessages(room.id);
      markGroupMessagesAsRead(room.id);
      onUserSelect?.();
    },
    [setSelectedRoom, loadRoomMessages, markGroupMessagesAsRead, onUserSelect]
  );

  const handleCreateRoom = async () => {
    if (roomName && selectedMembers.length > 0) {
      try {
        await createRoom(roomName, selectedMembers);
        setIsCreatingRoom(false);
        setRoomName("");
        setSelectedMembers([]);
        loadUserRooms();
      } catch (error) {
        console.error("Error creating room:", error);
      }
    }
  };

  return (
    <div className="w-80 border-r bg-gray-50 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b bg-white sticky top-0 z-10 flex items-center justify-between">
        <h2 className="text-lg font-semibold max-md:ml-10">Messages</h2>
        <Dialog open={isCreatingRoom} onOpenChange={setIsCreatingRoom}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="">
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
              <div className="space-y-2 max-h-60 overflow-y-auto">
                <p className="text-sm font-medium">Select Members:</p>
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center space-x-2 p-2  rounded-md"
                  >
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(user.id)}
                      onChange={(e) => {
                        setSelectedMembers((prev) =>
                          e.target.checked
                            ? [...prev, user.id]
                            : prev.filter((id) => id !== user.id)
                        );
                      }}
                      className="rounded"
                    />
                    <span>{user.username}</span>
                  </div>
                ))}
              </div>
              <Button
                onClick={handleCreateRoom}
                disabled={!roomName || selectedMembers.length === 0}
                className="w-full"
              >
                Create Group
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <div className="relative p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-1 p-2">
        {filteredRooms.map((room) => (
          <Button
            key={room.id}
            variant="ghost"
            className="w-full flex items-center justify-start space-x-3 hover:bg-gray-100"
            onClick={() => handleRoomSelect(room)}
          >
            <GroupAvatar
              name={room.name}
              unreadCount={unreadGroupCounts[room.id]}
            />
            <div>
              <p className="font-medium">{room.name}</p>
            </div>
          </Button>
        ))}

        {filteredUsers.map((user) => (
          <Button
            key={user.id}
            variant="ghost"
            className="w-full flex items-center justify-start space-x-3 "
            onClick={() => handleUserSelect(user)}
          >
            <UserAvatar
              username={user.username}
              isOnline={user.is_online}
              unreadCount={unreadCounts[user.id]}
            />
            <div>
              <p className="font-medium">{user.username}</p>
              <p className="text-sm text-gray-500">
                {user.is_online ? "Online" : "Offline"}
              </p>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};
