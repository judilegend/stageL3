"use client";
import { useState, useEffect } from "react";
import { useTasks } from "@/contexts/TaskContext";
import { TaskCard } from "./TaskCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TaskModal } from "./TaskModal";
import { Task } from "@/types/task";

interface ProjectTaskListProps {
  projectId: string;
}

export function ProjectTaskList({ projectId }: ProjectTaskListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { state, fetchProjectTasks, fetchAllTasks } = useTasks();
  const { projectTasks, loading, error } = state;

  const tasksByStatus: Record<string, Task[]> = {
    todo: projectTasks.filter((task) => task.status === "todo"),
    in_progress: projectTasks.filter((task) => task.status === "in_progress"),
    done: projectTasks.filter((task) => task.status === "done"),
  };

  const statusLabels = {
    todo: "À faire",
    in_progress: "En cours",
    done: "Terminé",
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 p-4 text-center">
        Une erreur est survenue lors du chargement des tâches
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          Tâches du Projet ({projectTasks.length} total)
        </h3>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Tâche
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* {Object.entries(tasksByStatus).map(([status, tasks]) => (
          <div key={status} className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-700">
                {statusLabels[status as keyof typeof statusLabels]}
                <span className="ml-2 text-sm text-gray-500">
                  ({tasks.length})
                </span>
              </h4>
            </div>
            <div className="space-y-3">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
              {tasks.length === 0 && (
                <div className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-md">
                  Aucune tâche dans cette catégorie
                </div>
              )}
            </div>
          </div>
        ))} */}
      </div>

      {/* <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectId={parseInt(projectId)}
      /> */}
    </div>
  );
}
export default ProjectTaskList;
