import { Router } from "express";
import { createNewGroup } from "../controllers/groupController.js";

const router = Router();

router.post("/", createNewGroup);

export default router;
