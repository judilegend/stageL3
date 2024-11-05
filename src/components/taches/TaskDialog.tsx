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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Task } from "@/types/task";

interface TaskDialogProps {
  task?: Task;
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Partial<Task>) => void;
}

export function TaskDialog({ task, isOpen, onClose, onSave }: TaskDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "important-urgent",
    status: "todo",
    assignee: "",
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        assignee: task.assignee || "",
      });
    }
  }, [task]);

  const handleSubmit = () => {
    onSave({
      ...formData,
      priority: formData.priority as Task["priority"],
      status: formData.status as Task["status"],
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {task ? "Modifier la tâche" : "Créer une nouvelle tâche"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Titre</label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Priorité</label>
              <Select
                value={formData.priority}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="important-urgent">
                    Important & Urgent
                  </SelectItem>
                  <SelectItem value="important-not-urgent">
                    Important & Non Urgent
                  </SelectItem>
                  <SelectItem value="not-important-urgent">
                    Non Important & Urgent
                  </SelectItem>
                  <SelectItem value="not-important-not-urgent">
                    Non Important & Non Urgent
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Statut</label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">À faire</SelectItem>
                  <SelectItem value="in-progress">En cours</SelectItem>
                  <SelectItem value="done">Terminé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Assigné à</label>
            <Input
              value={formData.assignee}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, assignee: e.target.value }))
              }
              placeholder="Nom de la personne assignée"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            {task ? "Mettre à jour" : "Créer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
