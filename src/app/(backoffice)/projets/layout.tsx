"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useCurrentProject } from "@/contexts/CurrentProjectContext";
import { projectService } from "@/services/projectService";

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const { setCurrentProject } = useCurrentProject();
  const projectId = params?.projectId as string;

  useEffect(() => {
    const loadProject = async () => {
      if (projectId) {
        const project = await projectService.getProjectById(projectId);
        setCurrentProject(project);
      }
    };

    loadProject();
  }, [projectId, setCurrentProject]);

  return <div className="h-full">{children}</div>;
}
