import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User } from "@/types/user";
import { useTasks } from "@/contexts/TaskContext";

interface TaskCardProps {
  task: any; // Replace with proper Task type
  users: User[];
}

export function TaskCard({ task, users }: TaskCardProps) {
  const { updateTask, deleteTask } = useTasks();

  const assignedUser = users?.find((user) => user.id === task.assignedUserId);

  const getPriorityColor = () => {
    if (task.importance === "important" && task.urgency === "urgent")
      return "bg-red-500";
    if (task.importance === "important" && task.urgency === "not-urgent")
      return "bg-yellow-500";
    if (task.importance === "not-important" && task.urgency === "urgent")
      return "bg-blue-500";
    return "bg-green-500";
  };

  return (
    <Card className="bg-white shadow-sm ">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h4 className="font-medium">{task.title}</h4>
            <p className="text-sm text-gray-500">{task.description}</p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className={getPriorityColor()}>
                {task.importance} / {task.urgency}
              </Badge>
              {assignedUser && (
                <Avatar className="h-6 w-fit  text-sm">
                  {/* <AvatarImage src={assignedUser.avatar} /> */}
                  <AvatarFallback className="px-4">
                    {assignedUser.username}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  updateTask(task.id, {
                    status:
                      task.status === "todo"
                        ? "in_progress"
                        : task.status === "in_progress"
                        ? "done"
                        : "todo",
                  })
                }
              >
                Changer le statut
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => deleteTask(task.id, task.activiteId)}
              >
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
