"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useProjects } from "@/contexts/ProjectContext";
import { projectService } from "@/services/projectService";

interface CreateProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateProjectDialog({
  isOpen,
  onClose,
}: CreateProjectDialogProps) {
  const { dispatch } = useProjects();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    clientName: "",
    clientSurname: "",
    clientPhone: "",
    clientEmail: "",
    requestedBudgetLowwer: "",
    requestedBudgetUpper: "",
    deadline: "",
  });

  const handleSubmit = async () => {
    try {
      const newProject = await projectService.createProject({
        ...formData,
        requestedBudgetLowwer: parseFloat(formData.requestedBudgetLowwer),
        requestedBudgetUpper: parseFloat(formData.requestedBudgetUpper),
        deadline: new Date(formData.deadline),
        status: "submitted",
        progress: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      dispatch({ type: "ADD_PROJECT", payload: newProject });

      const projects = await projectService.getAllProjects();
      dispatch({ type: "SET_PROJECTS", payload: projects });

      onClose();
      setFormData({
        title: "",
        description: "",
        clientName: "",
        clientSurname: "",
        clientPhone: "",
        clientEmail: "",
        requestedBudgetLowwer: "",
        requestedBudgetUpper: "",
        deadline: "",
      });
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Créer un nouveau projet</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Titre du projet</label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date limite</label>
              <Input
                type="date"
                value={formData.deadline}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, deadline: e.target.value }))
                }
              />
            </div>
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
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nom du client</label>
              <Input
                value={formData.clientName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    clientName: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Prénom du client</label>
              <Input
                value={formData.clientSurname}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    clientSurname: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Téléphone</label>
              <Input
                value={formData.clientPhone}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    clientPhone: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={formData.clientEmail}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    clientEmail: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Budget minimum</label>
              <Input
                type="number"
                value={formData.requestedBudgetLowwer}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    requestedBudgetLowwer: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Budget maximum</label>
              <Input
                type="number"
                value={formData.requestedBudgetUpper}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    requestedBudgetUpper: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        </div>
        <Button onClick={handleSubmit}>Créer le projet</Button>
      </DialogContent>
    </Dialog>
  );
}
