"use client";
import { useEffect, useState } from "react";
import { useTasks } from "@/contexts/TaskContext";
import { TaskCard } from "@/components/taches/TaskCard";
import { PomodoroTimer } from "@/components/pomodoro/PomodoroTimer";
import { TaskStats } from "@/components/taches/TaskStats";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TaskManagementPage() {
  const { user } = useAuth();
  const { state, fetchTasks } = useTasks();
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchTasks(user.id);
    }
  }, [user]);

  const userTasks = Object.values(state.tasksByActivity)
    .flat()
    .filter((task) => task.assignedUserId === user?.id);

  const activeTask = userTasks.find((task) => task.id === activeTaskId);

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Management Section */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="in-progress">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">My Tasks</h1>
              <TabsList>
                <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                <TabsTrigger value="todo">To Do</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="in-progress">
              <div className="space-y-4">
                {userTasks
                  .filter((task) => task.status === "in_progress")
                  .map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      // onSelect={() => setActiveTaskId(task.id)}
                      // isActive={task.id === activeTaskId}
                    />
                  ))}
              </div>
            </TabsContent>
            {/* Similar TabsContent for todo and completed */}
          </Tabs>
        </div>

        {/* Pomodoro and Stats Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Focus Timer</h2>
            <PomodoroTimer
              activeTask={activeTask}
              onComplete={() => {
                // Handle pomodoro completion
              }}
            />
          </div>

          <TaskStats tasks={userTasks} />
        </div>
      </div>
    </div>
  );
}
