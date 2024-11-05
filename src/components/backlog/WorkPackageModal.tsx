import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useWorkPackage } from "@/contexts/WorkpackageContext";
import { WorkPackage } from "@/types/workpackage";

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
}: WorkPackageModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const { addWorkPackage } = useWorkPackage();

  const handleSubmit = async () => {
    await addWorkPackage({
      ...formData,
      projectId,
    });
    onClose();
    setFormData({ title: "", description: "" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Créer un nouveau Work Package</DialogTitle>
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
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>Créer</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
