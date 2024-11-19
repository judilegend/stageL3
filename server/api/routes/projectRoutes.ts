import express from "express";
import {
  createProject,
  deleteProject,
  getAllProjects,
  getProjectById, // Ajout de l'import
  updateProject,
} from "../controllers/projectController";
import {
  authorizeAdmin,
  authorizeClient,
  authenticate,
} from "../middleware/authMiddleware";
import { authorizeProjectCreation } from "../middleware/roleMiddleware";

const router = express.Router();

// router.post("/", authenticate, authorizeClient, createProject);
// router.get("/", authenticate, authorizeAdmin, getAllProjects);
// router.put("/:id", authenticate, authorizeAdmin, updateProject);
// router.delete("/:id", authenticate, authorizeAdmin, deleteProject);

router.post("/", authenticate, authorizeProjectCreation, createProject);
router.get("/:id", getProjectById); // Ajout de la route manquante
router.get("/", getAllProjects);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);
export default router;
