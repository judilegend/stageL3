import { useEffect, memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Task } from "@/types/task";
import { useTasks } from "@/contexts/TaskContext";

interface TaskCardProps {
  task: Task;
}

export const TaskCard = memo(function TaskCard({ task }: TaskCardProps) {
  const { state, updateTask, deleteTask } = useTasks();
  const { users } = state;

  const assignedUser = users.find(
    (user) => user.id === Number(task.assignedUserId)
  );

  useEffect(() => {
    if (
      process.env.NODE_ENV === "development" &&
      task.assignedUserId &&
      !assignedUser &&
      users.length > 0
    ) {
      console.group("Task Assignment Debug");
      console.log("Task:", task);
      console.log("Assigned User ID:", task.assignedUserId);
      console.log("Available Users:", users);
      console.groupEnd();
    }
  }, [task, assignedUser, users]);

  const getPriorityColor = () => {
    if (task.importance === "important" && task.urgency === "urgent")
      return "bg-red-500";
    if (task.importance === "important" && task.urgency === "not-urgent")
      return "bg-yellow-500";
    if (task.importance === "not-important" && task.urgency === "urgent")
      return "bg-blue-500";
    return "bg-green-500";
  };

  const handleStatusChange = async () => {
    const newStatus =
      task.status === "todo"
        ? "in_progress"
        : task.status === "in_progress"
        ? "done"
        : "todo";
    await updateTask(task.id, { status: newStatus });
  };

  const handleDelete = async () => {
    await deleteTask(task.id, task.activiteId);
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h4 className="font-medium">{task.title}</h4>
            <p className="text-sm text-gray-500">{task.description}</p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className={getPriorityColor()}>
                {task.importance} / {task.urgency}
              </Badge>
              {assignedUser ? (
                <Avatar className="h-6 w-fit text-sm">
                  <AvatarFallback className="px-4">
                    {assignedUser.username}
                  </AvatarFallback>
                </Avatar>
              ) : task.assignedUserId ? (
                <Badge
                  variant="outline"
                  className="text-yellow-600 border-yellow-600"
                >
                  Utilisateur non trouvé
                </Badge>
              ) : null}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleStatusChange}>
                {task.status === "todo"
                  ? "Marquer en cours"
                  : task.status === "in_progress"
                  ? "Marquer terminé"
                  : "Marquer à faire"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
});

export default TaskCard;
