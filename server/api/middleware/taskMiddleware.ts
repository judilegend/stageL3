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
  isValidStatusTransition: (
    currentStatus: string,
    newStatus: string,
    role?: string
  ) => {
    if (role === "developer") {
      if (currentStatus === "in_progress" && newStatus === "review") {
        return true;
      }
      return false;
    }
    const leadRoles = ["scrum_master", "lead_developer", "tech_lead"];
    return leadRoles.includes(role || "");
  },
};
