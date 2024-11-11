"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useTasks } from "@/contexts/TaskContext";
import { TaskCard } from "@/components/taches/TaskCard";
import { PomodoroTimer } from "@/components/pomodoro/PomodoroTimer";
import { TaskStats } from "@/components/taches/TaskStats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProjectTasksPage() {
  const params = useParams();
  const projectId = params?.projectId as string;
  const { state, fetchTasks } = useTasks();

  useEffect(() => {
    if (projectId) {
      fetchTasks(parseInt(projectId));
    }
  }, [projectId]);

  const projectTasks = Object.values(state.tasksByActivity).flat();

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="in-progress">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Project Tasks</h1>
              <TabsList>
                <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                <TabsTrigger value="todo">To Do</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="in-progress">
              <div className="space-y-4">
                {projectTasks
                  .filter((task) => task.status === "in_progress")
                  .map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="todo">
              <div className="space-y-4">
                {projectTasks
                  .filter((task) => task.status === "todo")
                  .map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="completed">
              <div className="space-y-4">
                {projectTasks
                  .filter((task) => task.status === "done")
                  .map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Focus Timer</h2>
            <PomodoroTimer
              //   activeTask={null}
              onComplete={() => {
                // Handle pomodoro completion
              }}
            />
          </div>

          <TaskStats tasks={projectTasks} />
        </div>
      </div>
    </div>
  );
}
