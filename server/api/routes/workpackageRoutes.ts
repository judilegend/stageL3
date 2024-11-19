import express from "express";
import * as workpackageController from "../controllers/workpackageController";
import { authenticate } from "../middleware/authMiddleware";
import { authorizeWorkPackageManagement } from "../middleware/roleMiddleware";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorizeWorkPackageManagement,
  workpackageController.createWorkPackage
);
router.get(
  "/project/:projectId",
  // authenticate,
  workpackageController.getWorkPackagesByProjectId
);
router.put(
  "/:id",
  authenticate,
  authorizeWorkPackageManagement,
  workpackageController.updateWorkPackage
);
router.delete(
  "/:id",
  authenticate,
  authorizeWorkPackageManagement,
  workpackageController.deleteWorkPackage
);

export default router;
