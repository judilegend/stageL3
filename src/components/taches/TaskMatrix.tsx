"use client";
import { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BacklogCard } from "../backlog/BacklogCard";
import { useTasks } from "@/contexts/TaskContext";
import { useParams } from "next/navigation";
import { Task, ApiTask } from "@/types/task";

export function TaskMatrix() {
  const { state } = useTasks();
  const params = useParams();
  const projectId = params?.projectId as string;

  const normalizedTasks = useMemo(() => {
    const tasks = Array.isArray(state.projectTasks) ? state.projectTasks : [];
    return tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      assignedUserId: task.assignedUserId,
      activiteId: task.activiteId,
      importance: task.importance,
      urgency: task.urgency,
      estimatedPomodoros: task.estimatedPomodoros,
      completedPomodoros: task.completedPomodoros,
      projectId: parseInt(projectId),
    }));
  }, [state.projectTasks, projectId]);

  const categorizedTasks = useMemo(
    () => ({
      importantUrgent: normalizedTasks.filter(
        (task) => task.importance === "important" && task.urgency === "urgent"
      ),
      importantNotUrgent: normalizedTasks.filter(
        (task) =>
          task.importance === "important" && task.urgency === "not-urgent"
      ),
      notImportantUrgent: normalizedTasks.filter(
        (task) =>
          task.importance === "not-important" && task.urgency === "urgent"
      ),
      notImportantNotUrgent: normalizedTasks.filter(
        (task) =>
          task.importance === "not-important" && task.urgency === "not-urgent"
      ),
    }),
    [normalizedTasks]
  );

  return (
    <div className="grid grid-cols-2 gap-6">
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-red-700">
            Important & Urgent
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categorizedTasks.importantUrgent.map((task) => (
            <BacklogCard
              key={`matrix-task-${task.id}`}
              task={task}
              projectId={projectId}
            />
          ))}
          {categorizedTasks.importantUrgent.length === 0 && (
            <div className="text-sm text-gray-500 text-center py-4">
              Aucune tâche dans cette catégorie
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-yellow-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-yellow-700">
            Important & Non Urgent
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categorizedTasks.importantNotUrgent.map((task) => (
            <BacklogCard
              key={`matrix-task-${task.id}`}
              task={task}
              projectId={projectId}
            />
          ))}
          {categorizedTasks.importantNotUrgent.length === 0 && (
            <div className="text-sm text-gray-500 text-center py-4">
              Aucune tâche dans cette catégorie
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-orange-700">
            Non Important & Urgent
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categorizedTasks.notImportantUrgent.map((task) => (
            <BacklogCard
              key={`matrix-task-${task.id}`}
              task={task}
              projectId={projectId}
            />
          ))}
          {categorizedTasks.notImportantUrgent.length === 0 && (
            <div className="text-sm text-gray-500 text-center py-4">
              Aucune tâche dans cette catégorie
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-green-700">
            Non Important & Non Urgent
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categorizedTasks.notImportantNotUrgent.map((task) => (
            <BacklogCard
              key={`matrix-task-${task.id}`}
              task={task}
              projectId={projectId}
            />
          ))}
          {categorizedTasks.notImportantNotUrgent.length === 0 && (
            <div className="text-sm text-gray-500 text-center py-4">
              Aucune tâche dans cette catégorie
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
