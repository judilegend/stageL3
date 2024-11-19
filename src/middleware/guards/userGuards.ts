import { useAuth } from "@/contexts/AuthContext";
import { userManagementPermissions } from "../permissions/userPermissions";

export const useUserGuards = () => {
  const { user, isAuthenticated } = useAuth();

  return {
    canAccessUserManagement: () => {
      if (!user || !isAuthenticated) return false;
      return userManagementPermissions.canAccess(user.role);
    },
  };
};
