import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, MoreVertical } from "lucide-react";
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

interface BacklogCardProps {
  task: Task;
  projectId: string;
}

export const BacklogCard = memo(function BacklogCard({
  task,
  projectId,
}: BacklogCardProps) {
  const { state, updateTask } = useTasks();
  const { users } = state;

  const assignedUser = users.find(
    (user) => user.id === Number(task.assignedUserId)
  );

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
    const statusFlow = {
      todo: "in_progress",
      in_progress: "review",
      review: "done",
      done: "todo",
    } as const;
    const newStatus = statusFlow[task.status as keyof typeof statusFlow];
    await updateTask(task.id, { status: newStatus });
  };

  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h4 className="font-bold">{task.title}</h4>
            <p className="text-sm text-gray-500">{task.description}</p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className={getPriorityColor()}>
                {task.importance} / {task.urgency}
              </Badge>
              {assignedUser && (
                <Avatar className="h-6 w-fit text-sm">
                  <AvatarFallback className="px-4">
                    {assignedUser.username}
                  </AvatarFallback>
                </Avatar>
              )}
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
                Changer le statut
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
      <div className="mt-2 px-5 py-1">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>
            {task.completedPomodoros}/{task.estimatedPomodoros} pomodoros
          </span>
        </div>
      </div>
    </Card>
  );
});
