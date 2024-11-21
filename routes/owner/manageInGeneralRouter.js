import { Router } from "express";
import {
  clearDB,
  clearInvitations,
} from "../../controllers/admin/manageInGeneral.js";
import { deleteUser } from "../../controllers/admin/manageUsersController.js";

const router = Router();

router.delete("/clear-db", clearDB);
router.delete("/users/:userId", deleteUser);
router.delete("/invitations", clearInvitations);

export default router;
