import { Schema, model } from "mongoose";
import { modelRefType } from "../utils/helpers.js";

const projectMemberSchema = new Schema({
  userData: {
    userId: modelRefType("User"),
    username: String,
    email: String,
  },
  projectData: {
    projectId: modelRefType("Project"),
    projectName: String,
    description: String,
  },
});

const ProjectMember = model("ProjectMember", projectMemberSchema);
export default ProjectMember;
