import { useAuth } from "@/contexts/AuthContext";
import {
  projectPermissions,
  workPackagePermissions,
} from "../permissions/projectPermissions";

export const useProjectGuards = () => {
  const { user, isAuthenticated } = useAuth();
  console.log("Current user:", user); // Debug log
  console.log("Is authenticated:", isAuthenticated); // Debug log

  return {
    canCreateProject: () => {
      if (!user || !isAuthenticated) return false;
      return projectPermissions.canCreate(user.role);
    },
    canEditProject: () => {
      if (!user || !isAuthenticated) return false;
      return projectPermissions.canEdit(user.role);
    },
    canDeleteProject: () => {
      if (!user || !isAuthenticated) return false;
      return projectPermissions.canDelete(user.role);
    },
  };
};
export const useWorkPackageGuards = () => {
  const { user, isAuthenticated } = useAuth();
  console.log("Current user in guards:", user); // Debug log
  console.log("Is authenticated:", isAuthenticated); // Debug log

  return {
    canCreateWorkPackage: () => {
      const canCreate = workPackagePermissions.canCreate(user?.role);
      console.log("Can create work package:", canCreate, "Role:", user?.role); // Debug log
      return isAuthenticated && canCreate;
    },

    canEditWorkPackage: () => {
      if (!user || !isAuthenticated) return false;
      return workPackagePermissions.canEdit(user.role);
    },

    canDeleteWorkPackage: () => {
      if (!user || !isAuthenticated) return false;
      return workPackagePermissions.canDelete(user.role);
    },
  };
};
