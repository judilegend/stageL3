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
import { Calendar, DollarSign, User } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-yellow-100 text-yellow-800";
      case "in_review":
        return "bg-blue-100 text-blue-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-semibold">
            {project.title}
          </CardTitle>
          <Badge className={getStatusColor(project.status)}>
            {project.status.charAt(0).toUpperCase() +
              project.status.slice(1).replace("_", " ")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600 line-clamp-2">{project.description}</p>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <User className="h-4 w-4" />
          <span>
            {project.clientName} {project.clientSurname}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>Deadline: {formatDate(project.deadline)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <DollarSign className="h-4 w-4" />
          <span>
            Budget: {project.requestedBudgetLowwer} € -{" "}
            {project.requestedBudgetUpper} €
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-primary h-2.5 rounded-full"
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>
      </CardContent>
      <CardFooter className="text-sm text-gray-500">
        Créé le {formatDate(project.createdAt)}
      </CardFooter>
    </Card>
  );
}
