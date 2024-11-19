import express from "express";
import * as activiteController from "../controllers/activiteController";
import { authenticate } from "../middleware/authMiddleware";
import { authorizeActivityManagement } from "../middleware/roleMiddleware";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorizeActivityManagement,
  activiteController.createActivite
);
router.put(
  "/:id",
  authenticate,
  authorizeActivityManagement,
  activiteController.updateActivite
);
router.delete(
  "/:id",
  authenticate,
  authorizeActivityManagement,
  activiteController.deleteActivite
);
router.get(
  "/workpackage/:workPackageId",
  // authenticate,
  activiteController.getActivitesByWorkPackageId
);

export default router;
