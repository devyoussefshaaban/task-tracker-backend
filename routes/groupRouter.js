import { Router } from "express";
import { createNewGroup, getMyGroups } from "../controllers/groupController.js";

const router = Router();

router.post("/", createNewGroup);
router.get("/", getMyGroups);

export default router;
