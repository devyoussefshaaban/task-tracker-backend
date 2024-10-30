import { Router } from "express";
import {
  acceptInvitation,
  createNewProject,
  inviteProjectMember,
  manageProject,
  rejectInvitation,
} from "../controllers/projectController.js";
import { isProjectLeader } from "../middlewares/projectMiddleware.js";

const router = Router();

router.post("/:groupId/projects", createNewProject);
router.patch("/:groupId/projects/:projectId", isProjectLeader, manageProject);
router.post(
  "/:groupId/projects/:projectId/invitations",
  isProjectLeader,
  inviteProjectMember
);
router.get(
  "/:groupId/projects/:projectId/invitations/:invitationId/accept",
  acceptInvitation
);
router.get(
  "/:groupId/projects/:projectId/invitations/:invitationId/reject",
  rejectInvitation
);

export default router;
