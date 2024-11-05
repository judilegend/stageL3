"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useProjects } from "@/contexts/ProjectContext";
import { projectService } from "@/services/projectService";

interface DeleteProjectDialogProps {
  projectId: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteProjectDialog({
  projectId,
  isOpen,
  onClose,
}: DeleteProjectDialogProps) {
  const { dispatch } = useProjects();

  const handleDelete = async () => {
    try {
      await projectService.deleteProject(projectId.toString());
      dispatch({ type: "DELETE_PROJECT", payload: projectId.toString() });
      onClose();
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action ne peut pas être annulée. Le projet sera définitivement
            supprimé de nos serveurs.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
