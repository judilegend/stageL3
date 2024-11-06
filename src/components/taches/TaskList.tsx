"use client";
import { useState, useEffect } from "react";
import { useTasks } from "@/contexts/TaskContext";
import { useUsers } from "@/contexts/UserContext";
import { TaskCard } from "./TaskCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TaskModal } from "./TaskModal";

interface TaskListProps {
  activiteId: number;
}

export function TaskList({ activiteId }: TaskListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { state, fetchTasks } = useTasks();
  const { state: userState } = useUsers();

  useEffect(() => {
    fetchTasks(activiteId);
    console.log(activiteId);
  }, [activiteId]);

  const tasksByStatus = {
    todo: state.tasks.filter((task) => task.status === "todo"),
    in_progress: state.tasks.filter((task) => task.status === "in_progress"),
    done: state.tasks.filter((task) => task.status === "done"),
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Tâches</h3>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Tâche
        </Button>
      </div>

      <div className=" grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(tasksByStatus).map(([status, tasks]) => (
          <div key={status} className="space-y-4">
            <h4 className="font-medium capitalize">
              {status.replace("_", " ")}
              <span className="ml-2 text-sm text-gray-500">
                ({tasks.length})
              </span>
            </h4>
            <div className="w-[370px] space-y-3">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} users={userState.users} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activiteId={activiteId}
      />
    </div>
  );
}
