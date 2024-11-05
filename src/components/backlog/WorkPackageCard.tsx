import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WorkPackage } from "@/types/workpackage";

interface WorkPackageCardProps {
  workPackage: WorkPackage;
  onAddActivity: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function WorkPackageCard({
  workPackage,
  onAddActivity,
  onEdit,
  onDelete,
}: WorkPackageCardProps) {
  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">
          {workPackage.title}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onAddActivity}>
            <Plus className="h-4 w-4" />
          </Button>
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
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">{workPackage.description}</p>
      </CardContent>
    </Card>
  );
}
