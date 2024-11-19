export const taskPermissions = {
  canMarkAsReview: (role?: string) => {
    const allowedRoles = [
      "developer",
      "lead_developer",
      "tech_lead",
      "scrum_master",
    ];
    return role && allowedRoles.includes(role);
  },

  canMarkAsDone: (role?: string) => {
    const allowedRoles = ["scrum_master", "lead_developer", "tech_lead"];
    return role && allowedRoles.includes(role);
  },

  canMarkAsRedo: (role?: string) => {
    const allowedRoles = ["scrum_master", "lead_developer", "tech_lead"];
    return role && allowedRoles.includes(role);
  },

  canMoveTask: (
    role: string,
    userId: number,
    assignedUserId: number | null,
    currentStatus: string,
    newStatus: string
  ) => {
    const leadRoles = ["scrum_master", "lead_developer", "tech_lead"];

    if (leadRoles.includes(role)) {
      return true;
    }

    if (role === "developer") {
      const isAssignedDev = userId === assignedUserId;
      const isValidTransition =
        (currentStatus === "todo" && newStatus === "in_progress") ||
        (currentStatus === "in_progress" && newStatus === "review");
      return isAssignedDev && isValidTransition;
    }

    return false;
  },

  isValidStatusTransition: (
    currentStatus: string,
    newStatus: string,
    role?: string
  ) => {
    if (role === "developer") {
      return currentStatus === "in_progress" && newStatus === "review";
    }
    const leadRoles = ["scrum_master", "lead_developer", "tech_lead"];
    return leadRoles.includes(role || "");
  },
};
