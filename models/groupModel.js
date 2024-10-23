import { Schema, model } from "mongoose";
import { StringType } from "../utils/helpers.js";

const groupSchema = new Schema(
  {
    creatorId: {
      type: Schema.ObjectId,
      ref: "User",
    },
    groupName: StringType(3, 30, true, true),
    description: StringType(10, 300, false, false),
  },
  {
    timestamps: true,
  }
);

const Group = model("Group", groupSchema);
export default Group;
