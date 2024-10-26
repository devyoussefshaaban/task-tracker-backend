import { Schema, model } from "mongoose";
import { modelRefType } from "../utils/helpers.js";

const groupMemberSchema = new Schema({
  userData: {
    userId: modelRefType("User"),
    username: String,
    email: String,
  },
  groupData: {
    groupId: modelRefType("Group"),
    groupName: String,
    description: String,
  },
});

const GroupMember = model("GroupMember", groupMemberSchema);
export default GroupMember;
