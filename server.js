import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { connectDB } from "./configs/dbConfig.js";
import authRouter from "./routes/authRouter.js";
import tasksRouter from "./routes/tasksRouter.js";
import manageUsersRouter from "./routes/admin/manageUsersRouter.js";

config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/tasks", tasksRouter);
app.use("/api/v1/manage", manageUsersRouter);

const PORT = process.env.PORT || 4444;
app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
