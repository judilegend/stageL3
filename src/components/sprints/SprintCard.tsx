import { Sprint } from "@/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
} from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { TaskList } from "./TaskList";
import { AddTasksToSprintDialog } from "./AddTasksToSprintDialog";
import { useSprints } from "@/contexts/SprintContext";

interface SprintCardProps {
  sprint: Sprint;
}

export function SprintCard({ sprint }: SprintCardProps) {
  const [showTasks, setShowTasks] = useState(false);
  const [showAddTasks, setShowAddTasks] = useState(false);
  const { updateSprint } = useSprints();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_progress":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      default:
        return "bg-yellow-500";
    }
  };

  const getDaysRemaining = () => {
    const end = new Date(sprint.endDate);
    const now = new Date();
    return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const handleStatusChange = async () => {
    const newStatus =
      sprint.status === "in_progress" ? "completed" : "in_progress";
    await updateSprint(sprint.id, { status: newStatus });
  };

  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">{sprint.name}</CardTitle>
            <CardDescription className="mt-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {format(new Date(sprint.startDate), "MMM d")} -{" "}
                  {format(new Date(sprint.endDate), "MMM d, yyyy")}
                </span>
              </div>
            </CardDescription>
          </div>
          <Badge className={`${getStatusColor(sprint.status)} text-white`}>
            {sprint.status.replace("_", " ")}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Goal</h4>
          <p className="text-sm text-gray-600">{sprint.goal}</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-gray-500">{sprint.progress}%</span>
          </div>
          <Progress value={sprint.progress} className="h-2" />
        </div>

        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{getDaysRemaining()} days remaining</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span className="text-sm">
              {sprint.tasks?.filter((task) => task.status === "done").length ||
                0}{" "}
              completed tasks
            </span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <span className="text-sm">
              {sprint.tasks?.filter((task) => task.status !== "done").length ||
                0}{" "}
              pending tasks
            </span>
          </div>
        </div>

        {showTasks && (
          <div className="mt-4">
            <TaskList tasks={sprint.tasks || []} sprintId={sprint.id} />
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowTasks(!showTasks)}>
            {showTasks ? "Hide Tasks" : "Show Tasks"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowAddTasks(true)}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Add Tasks
          </Button>
        </div>
        <Button
          variant="secondary"
          onClick={handleStatusChange}
          disabled={sprint.status === "completed"}
        >
          {sprint.status === "in_progress" ? "Complete Sprint" : "Start Sprint"}
        </Button>
      </CardFooter>

      <AddTasksToSprintDialog
        open={showAddTasks}
        onOpenChange={setShowAddTasks}
        sprintId={sprint.id}
      />
    </Card>
  );
}
