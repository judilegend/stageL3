"use client";
import { useState, useEffect } from "react";
import { useTasks } from "@/contexts/TaskContext";
import { TaskCard } from "./TaskCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TaskModal } from "./TaskModal";
import { Task } from "@/types/task";
import { useTaskGuards } from "@/middleware/guards/projectGuards";
import { useAuth } from "@/contexts/AuthContext";
import Cookies from "js-cookie";

interface TaskListProps {
  activiteId: number;
}

export function TaskList({ activiteId }: TaskListProps) {
  //definir la permission
  const { user } = useAuth();
  const { canCreateTask } = useTaskGuards();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { state, fetchTasks } = useTasks();
  const { tasksByActivity, loading, error } = state;
  const { fetchProjectTasks } = useTasks();
  const { projectTasks } = state;

  // useEffect(() => {
  //   fetchProjectTasks();
  // }, []);
  useEffect(() => {
    fetchTasks(activiteId);
  }, [activiteId]);

  // Add this utility function at the top of the file
  function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const registration = await navigator.serviceWorker.ready;
        const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_KEY;
        const token = Cookies.get("token");

        if (!vapidPublicKey) {
          console.error("VAPID public key not found");
          return;
        }

        const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey,
        });

        const response = await fetch(
          `http://localhost:5000/api/notifications/subscribe`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
            body: JSON.stringify(subscription),
          }
        );

        if (!response.ok) {
          throw new Error("Subscription failed");
        }
      }
    } catch (error) {
      console.error("Notification permission error:", error);
    }
  };

  //effecter notification
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const activityTasks = tasksByActivity[activiteId] || [];

  const tasksByStatus: Record<string, Task[]> = {
    todo: activityTasks.filter((task) => task.status === "todo"),
    in_progress: activityTasks.filter((task) => task.status === "in_progress"),

    done: activityTasks.filter((task) => task.status === "done"),
  };

  const statusLabels = {
    todo: "À faire",
    in_progress: "En cours",
    in_review: "En revue",
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
        <h3 className="text-lg font-semibold">Tâches</h3>
        {user && canCreateTask() && (
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Tâche
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {Object.entries(tasksByStatus).map(([status, tasks]) => (
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

export default TaskList;
