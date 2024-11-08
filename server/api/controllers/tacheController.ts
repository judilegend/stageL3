import { Request, Response } from "express";
import * as tacheService from "../services/tacheService";
import * as eisenhowerService from "../services/eisenhowerService";

export const createTache = async (req: Request, res: Response) => {
  try {
    const tache = await tacheService.createTache(req.body);
    res.status(201).json(tache);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating tache", error: error.message });
  }
};
export const getTachesBySprintId = async (req: Request, res: Response) => {
  try {
    const { sprintId } = req.params;
    const taches = await tacheService.getTachesBySprintId(parseInt(sprintId));
    res.json(taches);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error fetching taches", error: error.message });
  }
};
// Add these new controller methods
export const createTacheForActivite = async (req: Request, res: Response) => {
  try {
    const { activiteId } = req.params;
    const tache = await tacheService.createTacheForActivite(
      parseInt(activiteId),
      req.body
    );
    res.status(201).json(tache);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating tache", error: error.message });
  }
};

export const assignTache = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const tache = await tacheService.updateTacheAssignment(
      parseInt(id),
      userId
    );
    res.json(tache);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error assigning tache", error: error.message });
  }
};

export const updateTacheStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const tache = await tacheService.updateTacheStatus(parseInt(id), status);

    res.json(tache);
  } catch (error) {
    res.status(400).json({
      message: "Error updating task status",
      error: error.message,
    });
  }
};
export const getTachesByActiviteId = async (req: Request, res: Response) => {
  try {
    const taches = await tacheService.getTachesByActiviteId(
      parseInt(req.params.activiteId)
    );
    res.json(taches);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error fetching taches", error: error.message });
  }
};
export const getTasksByCategory = async (req: Request, res: Response) => {
  try {
    const categorizedTasks = await tacheService.getTasksByCategory();
    res.json(categorizedTasks);
  } catch (error) {
    res.status(400).json({
      message: "Error fetching categorized tasks",
      error: error.message,
    });
  }
};
export const getAvailableTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await tacheService.getAvailableTasks();
    res.json(tasks);
  } catch (error) {
    res.status(400).json({
      message: "Error fetching available tasks",
      error: error.message,
    });
  }
};

export const updateTache = async (req: Request, res: Response) => {
  try {
    const tache = await tacheService.updateTache(
      parseInt(req.params.id),
      req.body
    );
    res.json(tache);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating tache", error: error.message });
  }
};

export const deleteTache = async (req: Request, res: Response) => {
  try {
    await tacheService.deleteTache(parseInt(req.params.id));
    res.json({ message: "Tache deleted successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error deleting tache", error: error.message });
  }
};
export const categorizeTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const { urgency, importance } = req.body;
    const task = await eisenhowerService.categorizeTask(
      parseInt(taskId),
      urgency,
      importance
    );
    res.json(task);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error categorizing task", error: error.message });
  }
};

export const getTasksByQuadrant = async (req: Request, res: Response) => {
  try {
    const quadrants = await eisenhowerService.getTasksByQuadrant();
    res.json(quadrants);
  } catch (error) {
    res.status(400).json({
      message: "Error fetching tasks by quadrant",
      error: error.message,
    });
  }
};
