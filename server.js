import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { connectDB } from "./configs/dbConfig.js";
import authRouter from "./routes/authRouter.js";
import tasksRouter from "./routes/tasksRouter.js";
import manageUsersRouter from "./routes/admin/manageUsersRouter.js";
import manageInGeneralRouter from "./routes/owner/manageInGeneralRouter.js";
import groupRouter from "./routes/groupRouter.js";
import { admin, auth, owner } from "./middlewares/authMiddleware.js";

config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/tasks", tasksRouter);
app.use("/api/v1/groups", auth, groupRouter);
app.use("/api/v1/manage", auth, admin, manageUsersRouter);
app.use("/api/v1/manage/general", auth, owner, manageInGeneralRouter);

const PORT = process.env.PORT || 4444;
app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
