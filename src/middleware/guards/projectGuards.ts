import { useAuth } from "@/contexts/AuthContext";
import {
  activityPermissions,
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

//activite
export const useActivityGuards = () => {
  const { user, isAuthenticated } = useAuth();
  const allowedRoles = [
    "admin",
    "product_owner",
    "lead_developer",
    "tech_lead",
    "scrum_master",
  ];

  return {
    canCreateActivity: () => {
      if (!user || !isAuthenticated) return false;
      return activityPermissions.canCreate(user.role);
    },

    canEditActivity: () => {
      if (!user || !isAuthenticated) return false;
      return activityPermissions.canEdit(user.role);
    },

    canDeleteActivity: () => {
      if (!user || !isAuthenticated) return false;
      return activityPermissions.canDelete(user.role);
    },
  };
};
//taches

// import { useAuth } from "@/contexts/AuthContext";

export const useTaskGuards = () => {
  const { user } = useAuth();
  const allowedRoles = [
    "admin",
    "product_owner",
    "lead_developer",
    "tech_lead",
    "scrum_master",
  ];

  const canCreateTask = () => {
    return user && allowedRoles.includes(user.role);
  };

  const canDeleteTask = () => {
    return user && allowedRoles.includes(user.role);
  };

  return { canCreateTask, canDeleteTask };
};
///sprint
export const useSprintGuards = () => {
  const { user } = useAuth();
  const allowedRoles = ["admin", "product_owner", "scrum_master"];

  const canCreateSprint = () => {
    return user && allowedRoles.includes(user.role);
  };

  const canAddTaskToSprint = () => {
    return (
      user &&
      ["admin", "product_owner", "scrum_master", "lead_developer"].includes(
        user.role
      )
    );
  };

  return { canCreateSprint, canAddTaskToSprint };
};
