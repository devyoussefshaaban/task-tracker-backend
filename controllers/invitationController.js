import Invitation from "../models/invitationModel.js";
import asyncHandler from "express-async-handler";
import { sendEmail } from "../utils/helpers.js";
import { INVITATION_STATUS } from "../utils/constants.js";
import Group from "../models/groupModel.js";
import User from "../models/userModel.js";

export const getMyInvitations = asyncHandler(async (req, res) => {
  try {
    const { user } = req;
    // TODO: CHECK THE ISSUE WITH $WHERE, NOT WORK
    // const sentInvitations = await Invitation.find({
    //   $where: () => this.sender.email === user.email,
    // });
    // const recievedInvitations = await Invitation.find({
    //   $where: () => this.reciever.email === user.email,
    // });

    // TODO: REMOVE THAT RUBBISH ONCE THE ABOVE ISSUE RESOLVED
    const sentInvitations = (await Invitation.find()).filter(
      (invitation) => invitation.sender.email === user.email
    );

    const recievedInvitations = (await Invitation.find()).filter(
      (invitation) => invitation.reciever.email === user.email
    );

    console.log("SENTT");
    res
      .status(200)
      .json({ success: true, data: { sentInvitations, recievedInvitations } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export const getInvitationInfo = asyncHandler(async (req, res) => {
  try {
    const {
      params: { invitationId },
    } = req;
    const invitation = await Invitation.findById(invitationId);
    if (!invitation) {
      res.status(404);
      throw new Error("Invitation not found.");
    }
    res.status(200).json({ success: true, data: invitation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export const inviteGroupMember = asyncHandler(async (req, res) => {
  try {
    const {
      user,
      group,
      body: { recieverEmail, title, message },
      params: { groupId },
    } = req;

    if (!recieverEmail || !title || !message)
      throw new Error("All fields are required, kindly fill them all.");

    console.log({ recieverEmail });

    // TODO: Fix bug of this filter, the recieverEmail is not defined err.
    // const invitation = await Invitation.findOne({
    //   $where: function () {
    //     return this.reciever.email === recieverEmail;
    //   },
    // });

    // TODO: Remove this method once the above error resolved.
    const invitation = (await Invitation.find()).find(
      (invitation) =>
        invitation.reciever.email === recieverEmail &&
        invitation.groupId === groupId
    );

    if (invitation)
      throw new Error(
        `An invitation already sent to that user, and it's status is ${invitation.status}`
      );

    const reciever = await User.findOne({ email: recieverEmail });

    let newInvitation;

    if (!reciever) {
      newInvitation = await Invitation.create({
        sender: {
          name: user.username,
          email: user.email,
        },
        reciever: {
          name: null,
          email: recieverEmail,
        },
        groupId,
        title,
        message,
      });

      const invitationUrl = `${process.env.BASE_URL}/invitations/groups/${groupId}/invitationList/${newInvitation._id}`;
      console.log(invitationUrl);

      await sendEmail(
        recieverEmail,
        `${group.groupName} - Invitation`,
        `Hey, ${recieverEmail}, kindly click this link to accept your invitation sent from ${user.email} to join the ${group.groupName} project. Kindly, click the followed link to accept the invitation and join the team ${invitationUrl}`
      );
    }

    newInvitation = await Invitation.create({
      sender: {
        name: user.username,
        email: user.email,
      },
      reciever: {
        name: reciever ? reciever.username : null,
        email: recieverEmail,
      },
      groupId,
      title,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Invitation sent successfully.",
      data: newInvitation,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export const acceptInvitation = asyncHandler(async (req, res) => {
  try {
    const {
      user,
      params: { invitationId },
    } = req;
    const invitation = await Invitation.findById(invitationId);
    if (!invitation) {
      res.status(404);
      throw new Error("Invitation not found.");
    }
    if (invitation.status !== INVITATION_STATUS.PENDING)
      throw new Error(`Invitation already ${invitation.status}`);
    if (invitation.reciever.email !== user.email) {
      res.status(403);
      throw new Error(
        "This invitation is not for you, you're not permitted to this action"
      );
    }
    invitation.$set("status", INVITATION_STATUS.ACCEPTED);
    await invitation.save();
    res.status(201).json({
      success: true,
      message: "Invitation accepted successfully.",
      data: invitation,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export const rejectInvitation = asyncHandler(async (req, res) => {
  try {
    const {
      user,
      params: { invitationId },
    } = req;
    const invitation = await Invitation.findById(invitationId);
    if (!invitation) {
      res.status(404);
      throw new Error("Invitation not found.");
    }
    if (invitation.status !== INVITATION_STATUS.PENDING)
      throw new Error(`Invitation already ${invitation.status}`);
    if (invitation.recieverId.toString() !== user._id.toString()) {
      res.status(403);
      throw new Error(
        "This invitation is not for you, you're not permitted to this action"
      );
    }
    invitation.$set("status", INVITATION_STATUS.REJECTED);
    await invitation.save();
    res.status(201).json({
      success: true,
      message: "Invitation rejected successfully.",
      data: invitation,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
