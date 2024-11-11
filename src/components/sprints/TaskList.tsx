import { Task } from "@/types";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useSprints } from "@/contexts/SprintContext";

interface TaskListProps {
  tasks: Task[];
  sprintId: number;
}

export function TaskList({ tasks, sprintId }: TaskListProps) {
  const { removeTaskFromSprint } = useSprints();

  const getStatusLabel = (status: string) => {
    const statusMap = {
      todo: "À faire",
      in_progress: "En cours",
      review: "En révision",
      done: "Terminé",
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap = {
      todo: "bg-yellow-500",
      in_progress: "bg-blue-500",
      review: "bg-purple-500",
      done: "bg-green-500",
    };
    return colorMap[status as keyof typeof colorMap] || "bg-gray-500";
  };

  return (
    <ScrollArea className="h-[200px] rounded-md border p-4">
      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <Checkbox
                checked={task.status === "done"}
                disabled={task.status === "done"}
              />
              <div>
                <h4 className="font-medium">{task.title}</h4>
                <p className="text-sm text-gray-500">{task.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={`${getStatusColor(task.status)} text-white`}>
                {getStatusLabel(task.status)}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeTaskFromSprint(sprintId, task.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
