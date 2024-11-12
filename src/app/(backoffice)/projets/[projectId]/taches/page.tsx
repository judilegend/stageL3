"use client";
import { useEffect, useState } from "react";
import { useTasks } from "@/contexts/TaskContext";
import { BacklogCard } from "@/components/backlog/BacklogCard";
import { PomodoroTimer } from "@/components/pomodoro/PomodoroTimer";
import { TaskStats } from "@/components/taches/TaskStats";
import { useCurrentProject } from "@/contexts/CurrentProjectContext";
import { useAuth } from "@/contexts/AuthContext";
import { ApiTask } from "@/types/task";

export default function ProjectTasksPage() {
  const { currentProject } = useCurrentProject();
  const { state, fetchProjectTasks } = useTasks();
  const { user } = useAuth();
  const [assignedTasks, setAssignedTasks] = useState<ApiTask[]>([]);

  useEffect(() => {
    const loadTasks = async () => {
      if (currentProject?.id) {
        await fetchProjectTasks(currentProject.id);
      }
    };
    loadTasks();
  }, [currentProject]);

  useEffect(() => {
    if (state.projectTasks && user) {
      const tasks = Array.isArray(state.projectTasks)
        ? state.projectTasks
        : [state.projectTasks];

      const userTasks = tasks
        .filter((task) => Number(task.assignedUserId) === user.id)
        .map((task) => ({
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
        }));

      setAssignedTasks(userTasks);
      console.log("User Tasks:", userTasks); // Debug log
    }
  }, [state.projectTasks, user]);

  const getTasksByStatus = (status: string) => {
    return assignedTasks.filter((task) => task.status === status);
  };

  const taskStatusSections = [
    { status: "in_progress", title: "En cours" },
    { status: "review", title: "À réviser" },
    { status: "done", title: "Terminé" },
    { status: "todo", title: "À faire" },
  ];

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Mes Tâches</h1>
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-gray-500">
                Projet: {currentProject?.title || "Non sélectionné"}
              </p>
              <p className="text-sm text-gray-500">
                Utilisateur: {user?.username} (ID: {user?.id})
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {taskStatusSections.map(({ status, title }) => {
              const tasks = getTasksByStatus(status);
              return (
                <div key={status} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-700">
                      {title}
                    </h2>
                    <span className="text-sm text-gray-500">
                      {tasks.length} tâches
                    </span>
                  </div>
                  <div className="grid gap-4">
                    {tasks.map((task) => (
                      <BacklogCard
                        key={task.task_id}
                        task={{
                          id: task.task_id,
                          title: task.task_title,
                          description: task.task_description,
                          status: task.status,
                          assignedUserId: task.assignedUserId,
                          activiteId: task.activity_id,
                          importance: task.importance,
                          urgency: task.urgency,
                          estimatedPomodoros: task.estimatedPomodoros,
                          completedPomodoros: task.completedPomodoros,
                        }}
                        projectId={currentProject?.id.toString() || ""}
                      />
                    ))}
                    {tasks.length === 0 && (
                      <div className="text-center py-4 bg-gray-50 rounded-lg text-gray-500">
                        Aucune tâche {title.toLowerCase()}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Focus Timer</h2>
            <PomodoroTimer
              onComplete={() => {
                console.log("Pomodoro completed");
              }}
            />
          </div>

          <TaskStats tasks={assignedTasks} />
        </div>
      </div>
    </div>
  );
}
