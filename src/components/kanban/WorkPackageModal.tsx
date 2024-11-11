"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { WorkPackage } from "@/types/workpackage";
import { useWorkPackage } from "@/contexts/WorkpackageContext";

interface WorkPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  workPackage?: WorkPackage | null;
}

export function WorkPackageModal({
  isOpen,
  onClose,
  projectId,
  workPackage,
}: WorkPackageModalProps) {
  const { addWorkPackage, updateWorkPackage } = useWorkPackage();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    if (workPackage) {
      setFormData({
        title: workPackage.title,
        description: workPackage.description,
      });
    } else {
      setFormData({
        title: "",
        description: "",
      });
    }
  }, [workPackage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (workPackage) {
        await updateWorkPackage(workPackage.id, {
          ...formData,
          projectId,
        });
      } else {
        await addWorkPackage({
          ...formData,
          projectId,
        });
      }
      onClose();
    } catch (error) {
      console.error("Error saving work package:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {workPackage ? "Modifier" : "Créer"} un Work Package
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Titre</label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Titre du work package"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Description du work package"
              rows={4}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">{workPackage ? "Modifier" : "Créer"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
