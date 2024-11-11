import { Request, Response } from "express";
import SprintService from "../services/sprintService";

class SprintController {
  async createSprint(req: Request, res: Response) {
    try {
      const sprint = await SprintService.createSprint(req.body);
      res.status(201).json(sprint);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllSprints(req: Request, res: Response) {
    try {
      const sprints = await SprintService.getAllSprints();
      res.json(sprints);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getSprintById(req: Request, res: Response) {
    try {
      const sprint = await SprintService.getSprintById(Number(req.params.id));
      if (!sprint) {
        return res.status(404).json({ message: "Sprint not found" });
      }
      res.json(sprint);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateSprint(req: Request, res: Response) {
    try {
      const sprint = await SprintService.updateSprint(
        Number(req.params.id),
        req.body
      );
      res.json(sprint);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteSprint(req: Request, res: Response) {
    try {
      await SprintService.deleteSprint(Number(req.params.id));
      res.json({ message: "Sprint deleted successfully" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async addTaskToSprint(req: Request, res: Response) {
    try {
      const { taskId } = req.body;
      const sprintId = Number(req.params.id);
      const task = await SprintService.addTaskToSprint(sprintId, taskId);
      await SprintService.updateSprintProgress(sprintId);
      res.json(task);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getSprintProgress(req: Request, res: Response) {
    try {
      const sprint = await SprintService.updateSprintProgress(
        Number(req.params.id)
      );
      res.json(sprint);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getActiveSprintTasks(req: Request, res: Response) {
    try {
      const tasks = await SprintService.getActiveSprintTasks(
        Number(req.params.id)
      );
      res.json(tasks);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new SprintController();
