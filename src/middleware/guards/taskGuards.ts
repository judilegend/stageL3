import { useAuth } from "@/contexts/AuthContext";
import { taskPermissions } from "../permissions/taskPermissions";

export const useTaskGuards = () => {
  const { user, isAuthenticated } = useAuth();

  return {
    canMoveToReview: () => {
      if (!user || !isAuthenticated) return false;
      return taskPermissions.canMarkAsReview(user.role);
    },

    canMoveToDone: () => {
      if (!user || !isAuthenticated) return false;
      return taskPermissions.canMarkAsDone(user.role);
    },

    canMoveToRedo: () => {
      if (!user || !isAuthenticated) return false;
      return taskPermissions.canMarkAsRedo(user.role);
    },

    canMoveTaskStatus: (
      assignedUserId: number | null,
      currentStatus: string,
      newStatus: string
    ) => {
      if (!user || !isAuthenticated) return false;
      return taskPermissions.canMoveTask(
        user.role,
        user.id,
        assignedUserId,
        currentStatus,
        newStatus
      );
    },
  };
};
