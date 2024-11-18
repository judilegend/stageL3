export const projectPermissions = {
  canCreate: (role?: string) => {
    const allowedRoles = ["admin", "product_owner", "scrum_master"];
    console.log("Checking role:", role); // Debug log
    return role ? allowedRoles.includes(role) : false;
  },

  canEdit: (role?: string) => {
    const allowedRoles = ["admin", "product_owner", "scrum_master"];
    return role ? allowedRoles.includes(role) : false;
  },

  canDelete: (role?: string) => {
    const allowedRoles = ["admin"];
    return role ? allowedRoles.includes(role) : false;
  },
};
