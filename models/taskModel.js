import { Schema, model } from "mongoose";
import { TASK_PRIORITY, TASK_STATUS } from "../utils/constants.js";
import { modelRefType } from "../utils/helpers.js";

const taskSchema = new Schema(
  {
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
    status: {
      type: String,
      default: TASK_STATUS.UPCOMING,
    },
    priority: {
      type: String,
      required: true,
      default: TASK_PRIORITY.NORMAL,
    },
    // NOTE: START-DATE IS REQUIRED AND SHOULD BE UPDATED IN THIS MODEL
    startDateTime: {
      type: Date,
      default: Date.now(),
    },
    // NOTE: END-DATE IS REQUIRED AND SHOULD BE UPDATED IN THIS MODEL
    endDateTime: {
      type: Date,
      default: Date.now(),
    },
    project: {
      _id: modelRefType("Project"),
      projectName: String,
      descrtiption: String,
    },
    category: {
      _id: String,
      categoryName: String,
      descrtiption: String,
    },
    creator: {
      _id: modelRefType("User"),
      username: String,
      email: String,
    },
    assignee: {
      _id: String,
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
