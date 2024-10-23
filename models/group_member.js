import { Schema, model } from "mongoose";
import { modelRefType } from "../utils/helpers";

const groupMemberSchema = new Schema(
  {
    userId: modelRefType("User"),
    groupId: modelRefType("Group"),
  },
  {
    timestamps: true,
  }
);

const GroupMember = model("GroupMember", groupMemberSchema);
export default GroupMember;
