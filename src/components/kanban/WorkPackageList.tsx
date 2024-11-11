"use client";

import { useState, useEffect } from "react";
import { WorkPackage } from "@/types/workpackage";
import { WorkPackageCard } from "./WorkPackageCard";
import { WorkPackageModal } from "./WorkPackageModal";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWorkPackage } from "@/contexts/WorkpackageContext";
import { useActivity } from "@/contexts/ActivityContext";
import { DeleteConfirmDialog } from "./DialogConfirmDialog";

interface WorkPackageListProps {
  projectId: string;
}

export function WorkPackageList({ projectId }: WorkPackageListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorkPackage, setEditingWorkPackage] =
    useState<WorkPackage | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [workPackageToDelete, setWorkPackageToDelete] = useState<string | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  const { workPackages, fetchWorkPackages, deleteWorkPackage } =
    useWorkPackage();
  const { activities, fetchActivities } = useActivity();

  useEffect(() => {
    fetchWorkPackages(projectId);
  }, [projectId]);

  useEffect(() => {
    workPackages.forEach((wp) => {
      fetchActivities(wp.id);
    });
  }, [workPackages]);
  const handleEdit = (workPackage: WorkPackage) => {
    setEditingWorkPackage(workPackage);
    setIsModalOpen(true);
  };

  const handleDeleteWorkPackage = (id: string) => {
    setWorkPackageToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteWorkPackage = async () => {
    if (workPackageToDelete) {
      try {
        await deleteWorkPackage(workPackageToDelete);
        await fetchWorkPackages(projectId);
      } catch (error) {
        console.error("Error deleting work package:", error);
      }
      setDeleteDialogOpen(false);
      setWorkPackageToDelete(null);
    }
  };

  const getActivitiesForWorkPackage = (workPackageId: string) => {
    return activities.filter(
      (activity) => activity.workPackageId === workPackageId
    );
  };

  const filteredAndSortedWorkPackages = workPackages
    .filter(
      (wp) =>
        wp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wp.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "alphabetical":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher un work package..."
              className="pl-9 w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Plus récent</SelectItem>
              <SelectItem value="alphabetical">Alphabétique</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Work Package
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedWorkPackages.map((workPackage) => (
          <WorkPackageCard
            key={workPackage.id}
            workPackage={workPackage}
            activities={getActivitiesForWorkPackage(workPackage.id)}
            onEdit={() => handleEdit(workPackage)}
            onDelete={() => handleDeleteWorkPackage(workPackage.id)}
          />
        ))}
      </div>

      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDeleteWorkPackage}
        title="Supprimer le Work Package"
        description="Êtes-vous sûr de vouloir supprimer ce work package ? Cette action supprimera également toutes les activités associées."
      />

      <WorkPackageModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingWorkPackage(null);
        }}
        projectId={projectId}
        workPackage={editingWorkPackage}
      />
    </div>
  );
}
