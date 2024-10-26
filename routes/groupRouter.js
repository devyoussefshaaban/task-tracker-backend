import { Router } from "express";
import {
  createNewGroup,
  editGroup,
  getGroupById,
  getMyGroups,
} from "../controllers/groupController.js";
import { isGroupCreator } from "../middlewares/groupMiddleware.js";

const router = Router();

router.post("/", createNewGroup);
router.get("/", getMyGroups);
router.get("/:groupId", getGroupById);
router.patch("/:groupId", isGroupCreator, editGroup);

export default router;
