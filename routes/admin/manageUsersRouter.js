import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
} from "../../controllers/admin/manageUsersController.js";

const router = Router();

router.get("/users", getAllUsers);
router.delete("/users/:userId", deleteUser);

export default router;
