import { useAuth } from "@/contexts/AuthContext";
import { projectPermissions } from "../permissions/projectPermissions";

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
