import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { WorkPackage } from "@/types/workpackage";
import { Activity } from "@/types/activity";
import { AddActivityForm } from "./AddActivityForm";
import { EditActivityForm } from "./EditActivityForm";
import { useActivity } from "@/contexts/ActivityContext";

interface WorkPackageCardProps {
  workPackage: WorkPackage;
  activities: Activity[];
  onEdit: () => void;
  onDelete: () => void;
}

export function WorkPackageCard({
  workPackage,
  activities,
  onEdit,
  onDelete,
}: WorkPackageCardProps) {
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<string | null>(null);
  const { fetchActivities, deleteActivity } = useActivity();

  const handleDeleteActivity = (activityId: string) => {
    setActivityToDelete(activityId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteActivity = async () => {
    if (activityToDelete) {
      try {
        await deleteActivity(activityToDelete);
        await fetchActivities(workPackage.id);
      } catch (error) {
        console.error("Error deleting activity:", error);
      }
      setDeleteDialogOpen(false);
      setActivityToDelete(null);
    }
  };

  return (
    <>
      <Card className="bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">
            {workPackage.title}
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>Modifier</DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-red-600">
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-gray-500">{workPackage.description}</p>

          <div className="space-y-3">
            {activities.map((activity) => (
              <Card key={activity.id} className="bg-gray-50">
                <CardContent className="p-3">
                  {editingActivity?.id === activity.id ? (
                    <EditActivityForm
                      activity={activity}
                      onCancel={() => setEditingActivity(null)}
                      onSuccess={() => {
                        setEditingActivity(null);
                        fetchActivities(workPackage.id);
                      }}
                    />
                  ) : (
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-sm">
                          {activity.title}
                        </h4>
                        {activity.description && (
                          <p className="text-sm text-gray-500 mt-1">
                            {activity.description}
                          </p>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => setEditingActivity(activity)}
                          >
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteActivity(activity.id)}
                            className="text-red-600"
                          >
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="pt-2">
            {isAddingActivity ? (
              <AddActivityForm
                workPackageId={workPackage.id}
                onSuccess={() => {
                  setIsAddingActivity(false);
                  fetchActivities(workPackage.id);
                }}
                onCancel={() => setIsAddingActivity(false)}
              />
            ) : (
              <Button
                variant="ghost"
                className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900"
                onClick={() => setIsAddingActivity(true)}
              >
                <Plus className="h-4 w-4" />
                Ajouter une activité
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer l'activité</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette activité ? Cette action
              est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteActivity}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
