import { Router } from "express";
import {
  createNewProject,
  getProjectInfo,
  manageProject,
} from "../controllers/projectController.js";
import { isProjectLeader } from "../middlewares/projectMiddleware.js";

const router = Router();

router.post("/:groupId/projects", createNewProject);
router.patch("/:groupId/projects/:projectId", isProjectLeader, manageProject);
router.get("/:groupId/projects/:projectId", getProjectInfo);

export default router;
