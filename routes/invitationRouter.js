import { Router } from "express";
import {
  acceptInvitation,
  getMyInvitations,
  inviteGroupMember,
  rejectInvitation,
} from "../controllers/invitationController.js";
import { isGroupAdmin } from "../middlewares/projectMiddleware.js";

const router = Router();

router.get("/", getMyInvitations);
router.post("/groups/:groupId/invite", isGroupAdmin, inviteGroupMember);
router.get(
  "/groups/:groupId/invitations/:invitationId/accept",
  acceptInvitation
);
router.get(
  "/groups/:groupId/invitations/:invitationId/reject",
  rejectInvitation
);

export default router;
