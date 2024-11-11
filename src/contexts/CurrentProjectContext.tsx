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
  selectProject: (projectId: string) => Promise<void>;
}

const CurrentProjectContext = createContext<
  CurrentProjectContextType | undefined
>(undefined);

export function CurrentProjectProvider({ children }: { children: ReactNode }) {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  const selectProject = async (projectId: string) => {
    try {
      const project = await projectService.getProjectById(projectId);
      setCurrentProject(project);
      localStorage.setItem("currentProjectId", projectId);
    } catch (error) {
      console.error("Error loading project:", error);
    }
  };

  useEffect(() => {
    const loadProject = async () => {
      const storedProjectId = localStorage.getItem("currentProjectId");
      const projectIdFromPath = pathname?.split("/")[2];

      if (projectIdFromPath) {
        await selectProject(projectIdFromPath);
      } else if (storedProjectId && !currentProject) {
        await selectProject(storedProjectId);
      }
      setLoading(false);
    };

    loadProject();
  }, [pathname]);

  return (
    <CurrentProjectContext.Provider
      value={{
        currentProject,
        setCurrentProject,
        loading,
        selectProject,
      }}
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
