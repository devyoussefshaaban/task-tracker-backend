import { Router } from "express";
import { clearDB } from "../../controllers/admin/manageInGeneral.js";
import { deleteUser } from "../../controllers/admin/manageUsersController.js";

const router = Router();

router.delete("/clear-db", clearDB);
router.delete("/users/:userId", deleteUser);

export default router;
