import { Task } from "@/types/task";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface TaskStatsProps {
  tasks: Task[];
}

export function TaskStats({ tasks }: TaskStatsProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "done").length;
  const completionRate =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const totalPomodoros = tasks.reduce(
    (acc, task) => acc + task.estimatedPomodoros,
    0
  );
  const completedPomodoros = tasks.reduce(
    (acc, task) => acc + task.completedPomodoros,
    0
  );

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Progress Overview</h2>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Task Completion</span>
            <span>{Math.round(completionRate)}%</span>
          </div>
          <Progress value={completionRate} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-2xl font-bold">
              {completedTasks}/{totalTasks}
            </div>
            <div className="text-sm text-gray-600">Tasks Completed</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-2xl font-bold">
              {completedPomodoros}/{totalPomodoros}
            </div>
            <div className="text-sm text-gray-600">Pomodoros Completed</div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Time Distribution</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span>Focus Time</span>
              <span>{completedPomodoros * 25} minutes</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
