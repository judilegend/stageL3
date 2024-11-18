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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, UserRole } from "@/types/user";
import { useUsers } from "@/contexts/UserContext";
import { userService } from "@/services/userService";

interface EditUserDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditUserDialog({
  user,
  isOpen,
  onClose,
}: EditUserDialogProps) {
  const { dispatch } = useUsers();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "" as UserRole,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        role: user.role,
      });
    }
  }, [user]);

  const handleSubmit = async () => {
    try {
      const updatedUser = await userService.updateUser(
        user?.id.toString() || "",
        formData
      );
      dispatch({ type: "UPDATE_USER", payload: updatedUser });

      const users = await userService.getAllUsers();
      dispatch({ type: "SET_USERS", payload: users });

      onClose();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier l'utilisateur</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nom d'utilisateur</label>
            <Input
              value={formData.username}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, username: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Rôle</label>
            <Select
              value={formData.role}
              onValueChange={(value: UserRole) =>
                setFormData((prev) => ({ ...prev, role: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrateur</SelectItem>
                <SelectItem value="user">Utilisateur</SelectItem>
                <SelectItem value="product_owner">Product owner</SelectItem>
                <SelectItem value="lead_developer">Lead Developer</SelectItem>
                <SelectItem value="scrum_master">Scrum Master</SelectItem>
                <SelectItem value="developper">Développeur</SelectItem>
                <SelectItem value="tech_lead">Tech Lead</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full mt-4" onClick={handleSubmit}>
            Mettre à jour
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
