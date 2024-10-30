import { Schema, model } from "mongoose";
import { modelRefType, StringType } from "../utils/helpers.js";

const projectSchema = new Schema({
  projectName: StringType(3, 30, false, true),
  description: StringType(10, 300, false, true),
  groupId: modelRefType("Group"),
  team: {
    leaderId: modelRefType("User"),
    members: [
      {
        memberId: modelRefType("User"),
      },
    ],
  },
});

const Project = model("Project", projectSchema);
export default Project;
