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
