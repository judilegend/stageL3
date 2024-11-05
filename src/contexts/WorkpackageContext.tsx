"use client";
import { createContext, useContext, ReactNode, useState } from "react";
import { WorkPackage } from "@/types/workpackage";
import * as workpackageService from "@/services/workpackage-service";

interface WorkPackageContextType {
  workPackages: WorkPackage[];
  fetchWorkPackages: (projectId: string) => Promise<void>;
  addWorkPackage: (workPackage: Partial<WorkPackage>) => Promise<void>;
  deleteWorkPackage: (id: string) => Promise<void>;
  updateWorkPackage: (
    id: string,
    workPackage: Partial<WorkPackage>
  ) => Promise<void>;
}

const WorkPackageContext = createContext<WorkPackageContextType | undefined>(
  undefined
);

export function WorkPackageProvider({ children }: { children: ReactNode }) {
  const [workPackages, setWorkPackages] = useState<WorkPackage[]>([]);

  const fetchWorkPackages = async (projectId: string) => {
    try {
      const data = await workpackageService.getWorkPackagesByProjectId(
        projectId
      );
      setWorkPackages(data);
    } catch (error) {
      console.error("Error fetching workpackages:", error);
    }
  };

  const addWorkPackage = async (workPackage: Partial<WorkPackage>) => {
    try {
      const newWorkPackage = await workpackageService.createWorkPackage(
        workPackage
      );
      setWorkPackages([...workPackages, newWorkPackage]);
    } catch (error) {
      console.error("Error adding workpackage:", error);
    }
  };

  const deleteWorkPackage = async (id: string) => {
    try {
      await workpackageService.deleteWorkPackage(id);
      setWorkPackages(workPackages.filter((wp) => wp.id !== id));
    } catch (error) {
      console.error("Error deleting workpackage:", error);
    }
  };

  const updateWorkPackage = async (
    id: string,
    workPackage: Partial<WorkPackage>
  ) => {
    try {
      const updatedWorkPackage = await workpackageService.updateWorkPackage(
        id,
        workPackage
      );
      setWorkPackages(
        workPackages.map((wp) => (wp.id === id ? updatedWorkPackage : wp))
      );
    } catch (error) {
      console.error("Error updating workpackage:", error);
    }
  };

  return (
    <WorkPackageContext.Provider
      value={{
        workPackages,
        fetchWorkPackages,
        addWorkPackage,
        deleteWorkPackage,
        updateWorkPackage,
      }}
    >
      {children}
    </WorkPackageContext.Provider>
  );
}

export const useWorkPackage = () => {
  const context = useContext(WorkPackageContext);
  if (!context)
    throw new Error("useWorkPackage must be used within a WorkPackageProvider");
  return context;
};
