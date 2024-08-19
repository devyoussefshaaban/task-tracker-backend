import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
} from "../../controllers/admin/manageUsersController.js";
import { admin, auth } from "../../middlewares/authMiddleware.js";

const router = Router();

router.get("/users", auth, admin, getAllUsers);
router.delete("/users/:userId", auth, admin, deleteUser);

export default router;
