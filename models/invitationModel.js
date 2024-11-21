import { Schema, model } from "mongoose";
import { EmailType, modelRefType, StringType } from "../utils/helpers.js";
import { INVITATION_STATUS } from "../utils/constants.js";

const invitationEnd = {
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
};

const invitationSchema = new Schema({
  sender: invitationEnd,
  reciever: invitationEnd,
  groupId: modelRefType("Group"),
  title: StringType(3, 30, false, true),
  message: StringType(10, 300, false, true),
  status: {
    type: String,
    default: INVITATION_STATUS.PENDING,
  },
});

const Invitation = model("Invitation", invitationSchema);
export default Invitation;
