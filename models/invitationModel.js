import { Schema, model } from "mongoose";
import { modelRefType, StringType } from "../utils/helpers.js";
import { INVITATION_STATUS } from "../utils/constants.js";

const invitationSchema = new Schema({
  senderId: modelRefType("User"),
  recieverId: modelRefType("User"),
  projectId: modelRefType("Project"),
  message: StringType(10, 300, false, true),
  status: {
    type: String,
    default: INVITATION_STATUS.PENDING,
  },
});

const Invitaion = model("Invitation", invitationSchema);
export default Invitaion;
