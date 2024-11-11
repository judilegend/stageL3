"use client";
import { useEffect, useState } from "react";
import { useTasks } from "@/contexts/TaskContext";
import { TaskCard } from "@/components/taches/TaskCard";
import { PomodoroTimer } from "@/components/pomodoro/PomodoroTimer";
import { TaskStats } from "@/components/taches/TaskStats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCurrentProject } from "@/contexts/CurrentProjectContext";
import { Task } from "@/types/task";

export default function ProjectTasksPage() {
  const { currentProject } = useCurrentProject();
  const { state, fetchTasks, updateTask } = useTasks();
  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState("in-progress");

  useEffect(() => {
    const loadTasks = async () => {
      if (currentProject?.id) {
        await fetchTasks(currentProject.id);
      }
    };
    loadTasks();
  }, [currentProject]);

  useEffect(() => {
    if (state.tasksByActivity) {
      const tasks = Object.values(state.tasksByActivity).flat();
      setLocalTasks(tasks);
    }
  }, [state.tasksByActivity]);

  const handleUpdateTaskStatus = async (taskId: number, newStatus: string) => {
    if (currentProject?.id) {
      try {
        await updateTask(taskId, {
          status: newStatus as "done" | "todo" | "in_progress" | "review",
        });
        await fetchTasks(currentProject.id);
      } catch (error) {
        console.error("Error updating task status:", error);
      }
    }
  };

  const getFilteredTasks = (status: string) => {
    return localTasks.filter((task) => task.status === status);
  };

  const taskStats = {
    total: localTasks.length,
    inProgress: getFilteredTasks("in_progress").length,
    todo: getFilteredTasks("todo").length,
    completed: getFilteredTasks("done").length,
  };

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold">Gestion des Tâches</h1>
                <p className="text-sm text-gray-500 mt-1">
                  {currentProject?.title || "Sélectionnez un projet"}
                </p>
              </div>
              <TabsList>
                <TabsTrigger value="in-progress">
                  En cours ({taskStats.inProgress})
                </TabsTrigger>
                <TabsTrigger value="todo">
                  À faire ({taskStats.todo})
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Terminées ({taskStats.completed})
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="in-progress">
              <div className="space-y-4">
                {getFilteredTasks("in_progress").map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
                {getFilteredTasks("in_progress").length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Aucune tâche en cours
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="todo">
              <div className="space-y-4">
                {getFilteredTasks("todo").map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
                {getFilteredTasks("todo").length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Aucune tâche à faire
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="completed">
              <div className="space-y-4">
                {getFilteredTasks("done").map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
                {getFilteredTasks("done").length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Aucune tâche terminée
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Focus Timer</h2>
            <PomodoroTimer
              onComplete={() => {
                // Handle pomodoro completion
                console.log("Pomodoro completed");
              }}
            />
          </div>

          <TaskStats tasks={localTasks} />
        </div>
      </div>
    </div>
  );
}
