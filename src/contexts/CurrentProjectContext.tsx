"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { Project } from "@/types/project";
import { projectService } from "@/services/projectService";

interface CurrentProjectContextType {
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  loading: boolean;
}

const CurrentProjectContext = createContext<
  CurrentProjectContextType | undefined
>(undefined);

export function CurrentProjectProvider({ children }: { children: ReactNode }) {
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
            console.error("Erreur de chargement du projet:", error);
          } finally {
            setLoading(false);
          }
        }
      }
    };

    loadProject();
  }, [pathname]);

  return (
    <CurrentProjectContext.Provider
      value={{ currentProject, setCurrentProject, loading }}
    >
      {children}
    </CurrentProjectContext.Provider>
  );
}

export const useCurrentProject = () => {
  const context = useContext(CurrentProjectContext);
  if (!context) {
    throw new Error(
      "useCurrentProject must be used within CurrentProjectProvider"
    );
  }
  return context;
};
