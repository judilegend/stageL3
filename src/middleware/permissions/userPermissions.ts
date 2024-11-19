export const userManagementPermissions = {
  canAccess: (role?: string) => {
    const allowedRoles = [
      "admin",
      "product_owner",
      "lead_developer",
      "tech_lead",
      "scrum_master",
    ];
    return role && allowedRoles.includes(role);
  },
};
