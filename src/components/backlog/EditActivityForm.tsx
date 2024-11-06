"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Activity } from "@/types/activity";
import { useActivity } from "@/contexts/ActivityContext";

interface EditActivityFormProps {
  activity: Activity;
  onCancel: () => void;
  onSuccess: () => void;
}

export function EditActivityForm({
  activity,
  onCancel,
  onSuccess,
}: EditActivityFormProps) {
  const [formData, setFormData] = useState({
    title: activity.title,
    description: activity.description || "",
  });

  const { updateActivity } = useActivity();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    await updateActivity(activity.id, {
      ...formData,
      workPackageId: activity.workPackageId,
    });

    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Titre de l'activité"
        value={formData.title}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, title: e.target.value }))
        }
        autoFocus
        required
      />
      <Textarea
        placeholder="Description (optionnel)"
        value={formData.description}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, description: e.target.value }))
        }
        rows={3}
      />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel} size="sm">
          Annuler
        </Button>
        <Button type="submit" size="sm">
          Mettre à jour
        </Button>
      </div>
    </form>
  );
}
