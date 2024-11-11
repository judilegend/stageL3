"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUsers } from "@/contexts/UserContext";
import { useTasks } from "@/contexts/TaskContext";
import { userService } from "@/services/userService";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  activiteId: number;
  task?: any;
}

export function TaskModal({
  isOpen,
  onClose,
  activiteId,
  task,
}: TaskModalProps) {
  const {
    state: { users },
    dispatch,
  } = useUsers();
  const { createTask, updateTask } = useTasks();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const fetchedUsers = await userService.getAllUsers();
        dispatch({ type: "SET_USERS", payload: fetchedUsers });
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    if (isOpen) {
      loadUsers();
    }
  }, [isOpen, dispatch]);

  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    assignedUserId: task?.assignedUserId?.toString() || "",
    importance: task?.importance || "not-important",
    urgency: task?.urgency || "not-urgent",
    estimatedPomodoros: task?.estimatedPomodoros || 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const taskData = {
        ...formData,
        assignedUserId:
          formData.assignedUserId === "0"
            ? null
            : parseInt(formData.assignedUserId),
      };

      if (task) {
        await updateTask(task.id, taskData);
      } else {
        await createTask({
          ...taskData,
          activiteId,
          status: "todo",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          completedPomodoros: 0,
          sprintId: null,
        });
      }
      onClose();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {task ? "Modifier la tâche" : "Nouvelle tâche"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="assignedUser">Assigné à</Label>
            <Select
              value={formData.assignedUserId}
              onValueChange={(value) =>
                setFormData({ ...formData, assignedUserId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un utilisateur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Non assigné</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Importance</Label>
              <Select
                value={formData.importance}
                onValueChange={(value) =>
                  setFormData({ ...formData, importance: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="important">Important</SelectItem>
                  <SelectItem value="not-important">Non important</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Urgence</Label>
              <Select
                value={formData.urgency}
                onValueChange={(value) =>
                  setFormData({ ...formData, urgency: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="not-urgent">Non urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">{task ? "Mettre à jour" : "Créer"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
