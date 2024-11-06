"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useActivity } from "@/contexts/ActivityContext";

interface AddActivityFormProps {
  workPackageId: string;
  onCancel: () => void;
  onSuccess: () => void;
}

export function AddActivityForm({
  workPackageId,
  onCancel,
  onSuccess,
}: AddActivityFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const { addActivity } = useActivity();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    await addActivity({
      ...formData,
      workPackageId,
      status: "todo",
    });

    onSuccess();
    setFormData({ title: "", description: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          placeholder="Titre de l'activité"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          autoFocus
          required
        />
      </div>
      <div className="space-y-2">
        <Textarea
          placeholder="Description (optionnel)"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          rows={3}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel} size="sm">
          Annuler
        </Button>
        <Button type="submit" size="sm">
          Ajouter
        </Button>
      </div>
    </form>
  );
}
