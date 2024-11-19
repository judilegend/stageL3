import { Request, Response, NextFunction } from "express";

export const authorizeProjectCreation = (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => {
  const allowedRoles = ["admin", "product_owner", "scrum_master"];

  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      message:
        "Access denied. Only Product Owner, Admin, or Scrum Master can create projects.",
    });
  }

  next();
};

// New work package management middleware
export const authorizeWorkPackageManagement = (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => {
  const allowedRoles = [
    "admin",
    "product_owner",
    "lead_developer",
    "tech_lead",
  ];

  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      message:
        "Access denied. Only Admin, Product Owner, Lead Developer or Tech Lead can manage work packages.",
    });
  }

  next();
};

//activite
export const authorizeActivityManagement = (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => {
  const allowedRoles = [
    "admin",
    "product_owner",
    "lead_developer",
    "tech_lead",
    "scrum_master",
  ];

  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      message:
        "Access denied. Only authorized team members can manage activities.",
    });
  }

  next();
};
