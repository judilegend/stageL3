import { Request, Response } from "express";
import * as activiteService from "../services/activiteService";

export const createActivite = async (req: Request, res: Response) => {
  try {
    const activite = await activiteService.createActivite(req.body);
    res.status(201).json(activite);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res
        .status(400)
        .json({ message: "Error creating activite", error: error.message });
    } else {
      res.status(400).json({
        message: "Error creating activite",
        error: "An unknown error occurred",
      });
    }
  }
};
export const getActivitesByWorkPackageId = async (
  req: Request,
  res: Response
) => {
  try {
    const activites = await activiteService.getActivitesByWorkPackageId(
      parseInt(req.params.workPackageId)
    );
    res.json(activites);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res
        .status(400)
        .json({ message: "Error fetching activites", error: error.message });
    } else {
      res.status(400).json({
        message: "Error fetching activites",
        error: "An unknown error occurred",
      });
    }
  }
};
export const updateActivite = async (req: Request, res: Response) => {
  try {
    const activite = await activiteService.updateActivite(
      parseInt(req.params.id),
      req.body
    );
    res.json(activite);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res
        .status(400)
        .json({ message: "Error updating activite", error: error.message });
    } else {
      res.status(400).json({
        message: "Error updating activite",
        error: "An unknown error occurred",
      });
    }
  }
};
export const deleteActivite = async (req: Request, res: Response) => {
  try {
    await activiteService.deleteActivite(parseInt(req.params.id));
    res.json({ message: "Activite deleted successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res
        .status(400)
        .json({ message: "Error deleting activite", error: error.message });
    } else {
      res.status(400).json({
        message: "Error deleting activite",
        error: "An unknown error occurred",
      });
    }
  }
};
