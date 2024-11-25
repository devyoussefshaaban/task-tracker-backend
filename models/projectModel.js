import { Schema, model } from "mongoose";
import { modelRefType, StringType } from "../utils/helpers.js";
import { CURRENCY, TASK_STATUS } from "../utils/constants.js";

const projectSchema = new Schema({
  projectName: StringType(3, 30, false, true),
  description: StringType(10, 300, false, true),
  groupId: modelRefType("Group"),
  leader: {
    userId: modelRefType("User"),
    username: String,
    email: String,
  },
  status: {
    type: String,
    default: TASK_STATUS.NOT_STARTED,
  },
  budget: {
    amount: {
      type: Number,
      required: true,
      default: 1000,
    },
    currency: {
      type: String,
      required: true,
      default: CURRENCY.USD,
    },
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  endDate: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

const Project = model("Project", projectSchema);
export default Project;
