"use client";
import { Project } from "@/types/project";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  DollarSign,
  User,
  Pencil,
  Trash2,
  MoreVertical,
  Layout,
  ArrowRight,
} from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import EditProjectDialog from "./EditProjectDialog";
import DeleteProjectDialog from "./DeleteProjectDialog";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useProjectGuards } from "@/middleware/guards/projectGuards";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  //definir autorisation
  const { user } = useAuth();

  const { canEditProject, canDeleteProject } = useProjectGuards();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "in_review":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "approved":
        return "bg-green-100 text-green-800 border border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return "bg-green-500";
    if (progress >= 50) return "bg-yellow-500";
    if (progress >= 25) return "bg-orange-500";
    return "bg-red-500";
  };

  const getStatusLabel = (status: string) => {
    const statusMap = {
      submitted: "Soumis",
      in_review: "En révision",
      approved: "Approuvé",
      rejected: "Rejeté",
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 bg-white border-gray-100">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-semibold text-gray-900">
            {project.title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge
              className={`${getStatusColor(
                project.status
              )} px-3 py-1 rounded-full`}
            >
              {getStatusLabel(project.status)}
            </Badge>
            {user && (canEditProject() || canDeleteProject()) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                  >
                    <MoreVertical className="h-4 w-4 text-gray-600" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {canEditProject() && (
                    <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Modifier
                    </DropdownMenuItem>
                  )}
                  {canDeleteProject() && (
                    <DropdownMenuItem
                      onClick={() => setIsDeleteDialogOpen(true)}
                      className="text-red-600 focus:text-red-700 focus:bg-red-50"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-gray-600 line-clamp-2 text-sm">
          {project.description}
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="h-4 w-4 text-gray-400" />
            <span className="truncate">
              {project.clientName} {project.clientSurname}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>{formatDate(project.deadline)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <DollarSign className="h-4 w-4 text-gray-400" />
          <span>
            {formatCurrency(project.requestedBudgetLowwer)} -{" "}
            {formatCurrency(project.requestedBudgetUpper)}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progression</span>
            <span className="font-medium">{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className={`${getProgressColor(
                project.progress
              )} h-2 rounded-full transition-all duration-300`}
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4 flex justify-between items-center border-t">
        <span className="text-xs text-gray-500">
          Créé le {formatDate(project.createdAt)}
        </span>
        <Link href={`/projets/${project.id}/kanban`}>
          <Button
            variant="default"
            className="bg-gray-50 text-gray-500 gap-2 group"
          >
            <Layout className="h-4 w-4" />
            Interface Kanban
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardFooter>

      <EditProjectDialog
        project={project}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      <DeleteProjectDialog
        projectId={project.id}
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      />
    </Card>
  );
}
