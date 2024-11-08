import express from "express";
import SprintController from "../controllers/sprintController";
// import { authenticateToken } from "../middleware/auth";

const router = express.Router();

// Protection de toutes les routes avec authentification
// router.use(authenticateToken);

// Routes CRUD de base
router.post("/", SprintController.createSprint);
router.get("/", SprintController.getAllSprints);
router.get("/:id", SprintController.getSprintById);
router.put("/:id", SprintController.updateSprint);
router.delete("/:id", SprintController.deleteSprint);

// Routes spécifiques aux fonctionnalités du sprint
router.post("/:id/tasks", SprintController.addTaskToSprint);
router.get("/:id/progress", SprintController.getSprintProgress);
router.get("/:id/active-tasks", SprintController.getActiveSprintTasks);

export default router;
