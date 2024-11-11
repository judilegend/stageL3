"use client";
import { useEffect, useCallback, useState } from "react";
import { KanbanBoard } from "@/components/backlog/KanbanBoard";
import { TaskMatrix } from "@/components/taches/TaskMatrix";
import { useTasks } from "@/contexts/TaskContext";
import { useParams } from "next/navigation";
import { ApiTask } from "@/types/task";

export default function BacklogPage() {
  const { state, fetchProjectTasks, updateTask } = useTasks();
  const params = useParams();
  const projectId = params?.projectId as string;
  const [localTasks, setLocalTasks] = useState<ApiTask[]>([]);

  useEffect(() => {
    const loadTasks = async () => {
      if (projectId) {
        await fetchProjectTasks(parseInt(projectId));
      }
    };
    loadTasks();
  }, [projectId]);

  useEffect(() => {
    if (state.projectTasks) {
      const tasks = Array.isArray(state.projectTasks)
        ? state.projectTasks
        : [state.projectTasks];
      setLocalTasks(
        tasks.map((task) => ({
          task_id: task.id,
          task_title: task.title,
          task_description: task.description,
          status: task.status,
          assignedUserId: task.assignedUserId,
          activity_id: task.activiteId,
          importance: task.importance,
          urgency: task.urgency,
          estimatedPomodoros: task.estimatedPomodoros,
          completedPomodoros: task.completedPomodoros,
        }))
      );
    }
  }, [state.projectTasks]);

  const handleUpdateTask = useCallback(
    async (id: number, update: { status: string }) => {
      try {
        await updateTask(id, {
          status: update.status as "done" | "todo" | "in_progress" | "review",
        });
        await fetchProjectTasks(parseInt(projectId));
      } catch (error) {
        console.error("Error updating task:", error);
      }
    },
    [updateTask, fetchProjectTasks, projectId]
  );

  return (
    <div className="space-y-8 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Backlog du Projet</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            {localTasks.length} tâches
          </span>
        </div>
      </div>
      <KanbanBoard
        projectId={projectId}
        tasks={localTasks}
        onUpdateTask={handleUpdateTask}
      />
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-6">Matrice des Tâches</h2>
        <TaskMatrix />
      </div>
    </div>
  );
}
