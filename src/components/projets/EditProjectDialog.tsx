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
import { Project, ProjectStatus } from "@/types/project";
import { useProjects } from "@/contexts/ProjectContext";
import { projectService } from "@/services/projectService";

interface EditProjectDialogProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProjectDialog({
  project,
  isOpen,
  onClose,
}: EditProjectDialogProps) {
  const { dispatch } = useProjects();

  const [formData, setFormData] = useState({
    title: project?.title || "",
    description: project?.description || "",
    clientName: project?.clientName || "",
    clientSurname: project?.clientSurname || "",
    clientPhone: project?.clientPhone || "",
    clientEmail: project?.clientEmail || "",
    requestedBudgetLowwer: project?.requestedBudgetLowwer?.toString() || "0",
    requestedBudgetUpper: project?.requestedBudgetUpper?.toString() || "0",
    deadline: project?.deadline
      ? new Date(project.deadline).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    status: project?.status || ("submitted" as ProjectStatus),
    progress: project?.progress || 0,
  });

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description,
        clientName: project.clientName,
        clientSurname: project.clientSurname,
        clientPhone: project.clientPhone,
        clientEmail: project.clientEmail,
        requestedBudgetLowwer: project.requestedBudgetLowwer?.toString(),
        requestedBudgetUpper: project.requestedBudgetUpper?.toString(),
        deadline: new Date(project.deadline)?.toISOString().split("T")[0],
        status: project.status,
        progress: project.progress,
      });
    }
  }, [project]);

  const handleSubmit = async () => {
    try {
      const updatedProject = await projectService.updateProject(
        project.id.toString(),
        {
          ...formData,
          requestedBudgetLowwer: parseFloat(formData.requestedBudgetLowwer),
          requestedBudgetUpper: parseFloat(formData.requestedBudgetUpper),
          deadline: new Date(formData.deadline),
        }
      );

      dispatch({ type: "UPDATE_PROJECT", payload: updatedProject });
      onClose();
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Modifier le projet</DialogTitle>
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
              <label className="text-sm font-medium">Statut</label>
              <Select
                value={formData.status}
                onValueChange={(value: ProjectStatus) =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="submitted">Soumis</SelectItem>
                  <SelectItem value="in_review">En révision</SelectItem>
                  <SelectItem value="approved">Approuvé</SelectItem>
                  <SelectItem value="rejected">Rejeté</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Progression (%)</label>
              <Input
                type="number"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    progress: parseInt(e.target.value),
                  }))
                }
              />
            </div>
          </div>

          {/* Client information fields */}
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
        <Button onClick={handleSubmit}>Mettre à jour le projet</Button>
      </DialogContent>
    </Dialog>
  );
}
