//project
export const projectPermissions = {
  canCreate: (role?: string) => {
    const allowedRoles = ["admin", "product_owner", "scrum_master"];
    // console.log("Checking role:", role); // Debug log
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
//work package
export const workPackagePermissions = {
  canCreate: (role?: string) => {
    const allowedRoles = [
      "admin",
      "product_owner",
      "lead_developer",
      "tech_lead",
    ];
    return role ? allowedRoles.includes(role) : false;
  },

  canEdit: (role?: string) => {
    const allowedRoles = [
      "admin",
      "product_owner",
      "lead_developer",
      "tech_lead",
    ];
    return role ? allowedRoles.includes(role) : false;
  },

  canDelete: (role?: string) => {
    const allowedRoles = ["admin", "product_owner"];
    return role ? allowedRoles.includes(role) : false;
  },
};

///activity
export const activityPermissions = {
  canCreate: (role?: string) => {
    const allowedRoles = [
      "admin",
      "product_owner",
      "lead_developer",
      "tech_lead",
      "scrum_master",
    ];
    return role ? allowedRoles.includes(role) : false;
  },

  canEdit: (role?: string) => {
    const allowedRoles = [
      "admin",
      "product_owner",
      "lead_developer",
      "tech_lead",
      "scrum_master",
    ];
    return role ? allowedRoles.includes(role) : false;
  },

  canDelete: (role?: string) => {
    const allowedRoles = ["admin", "product_owner", "lead_developer"];
    return role ? allowedRoles.includes(role) : false;
  },
};

//sprint
export const sprintPermissions = {
  canCreate: (role?: string) => {
    const allowedRoles = ["admin", "product_owner", "scrum_master"];
    return role && allowedRoles.includes(role);
  },
  canEdit: (role?: string) => {
    const allowedRoles = ["admin", "product_owner", "scrum_master"];
    return role && allowedRoles.includes(role);
  },
  canDelete: (role?: string) => {
    const allowedRoles = ["admin", "product_owner"];
    return role && allowedRoles.includes(role);
  },
};
