"use client";
import { createContext, useContext, ReactNode, useState } from "react";
import { WorkPackage } from "@/types/workpackage";
import * as workpackageService from "@/services/workpackage-service";
import { useWorkPackageGuards } from "@/middleware/guards/projectGuards";

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
  const { canCreateWorkPackage, canEditWorkPackage, canDeleteWorkPackage } =
    useWorkPackageGuards();

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
    const hasPermission = canCreateWorkPackage();
    console.log("Permission check:", hasPermission); // Debug log

    if (!hasPermission) {
      throw new Error("Unauthorized to create work package");
    }

    try {
      const newWorkPackage = await workpackageService.createWorkPackage(
        workPackage
      );
      setWorkPackages([...workPackages, newWorkPackage]);
    } catch (error: any) {
      console.error("Error details:", error.message); // Debug log
      throw error;
    }
  };

  const deleteWorkPackage = async (id: string) => {
    if (!canDeleteWorkPackage()) {
      throw new Error("Unauthorized to delete work package");
    }

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
    if (!canEditWorkPackage()) {
      throw new Error("Unauthorized to edit work package");
    }

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
