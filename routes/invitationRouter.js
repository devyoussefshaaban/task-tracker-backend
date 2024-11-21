import { Router } from "express";
import {
  acceptInvitation,
  getInvitationInfo,
  getMyInvitations,
  inviteGroupMember,
  rejectInvitation,
} from "../controllers/invitationController.js";
import { isGroupAdmin } from "../middlewares/projectMiddleware.js";

const router = Router();

router.get("/", getMyInvitations);
router.get("/:invitationId", getInvitationInfo);
router.post("/groups/:groupId/invite", isGroupAdmin, inviteGroupMember);
router.post(
  "/groups/:groupId/invitations/:invitationId/accept",
  acceptInvitation
);
router.get(
  "/groups/:groupId/invitations/:invitationId/reject",
  rejectInvitation
);

export default router;
