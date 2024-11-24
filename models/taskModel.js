import { Schema, model } from "mongoose";
import { TASK_PRIORITY, TASK_STATUS } from "../utils/constants.js";
import { modelRefType } from "../utils/helpers.js";

const taskSchema = new Schema(
  {
    creator: {
      userId: modelRefType("User"),
      username: String,
      email: String,
    },
    title: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 30,
    },
    description: {
      type: String,
      required: true,
      minLength: 10,
      maxLength: 300,
    },
    project: {
      projectId: modelRefType("Project"),
      projectName: String,
    },
    startDate: {
      type: Date,
      default: Date.now(),
    },
    // NOTE: END-DATE IS REQUIRED AND SHOULD BE UPDATED IN THIS MODEL
    endDate: {
      type: Date,
      default: Date.now(),
    },
    priority: {
      type: String,
      required: true,
      default: TASK_PRIORITY.NORMAL,
    },
    status: {
      type: String,
      default: TASK_STATUS.NOT_STARTED,
    },
    assignee: {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      username: String,
      email: String,
    },
  },
  {
    timestamps: true,
  }
);

const Task = model("Task", taskSchema);
export default Task;
