import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { projectService } from "@/services/projectService";
import { Project } from "@/types/project";

export function useCurrentProject() {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const loadProject = async () => {
      if (pathname) {
        const projectId = pathname.split("/")[2];
        if (projectId) {
          try {
            const project = await projectService.getProjectById(projectId);
            setCurrentProject(project);
          } catch (error) {
            console.error("Erreur lors du chargement du projet:", error);
          } finally {
            setLoading(false);
          }
        }
      } else {
        setLoading(false);
      }
    };

    loadProject();
  }, [pathname]);

  return { currentProject, loading };
}
