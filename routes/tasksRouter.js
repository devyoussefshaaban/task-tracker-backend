import { Router } from "express";
import { auth } from "../middlewares/authMiddleware.js";
import { deleteTask, getMyTasks, createTask, updateTask } from "../controllers/tasksController.js";
import { checkTaskAndUserAuth } from "../middlewares/taskMiddleware.js";

const router = Router()

router.get("/", auth, getMyTasks)
router.post("/", auth, createTask)
router.patch("/:taskId", auth, checkTaskAndUserAuth, updateTask)
router.delete("/:taskId", auth, checkTaskAndUserAuth, deleteTask)

export default router