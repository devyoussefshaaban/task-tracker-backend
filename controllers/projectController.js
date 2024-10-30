import Invitation from "../models/invitationModel.js";
import Project from "../models/projectModel.js";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import Yup from "yup";
import { sendEmail } from "../utils/helpers.js";
import { INVITATION_STATUS } from "../utils/constants.js";

export const createNewProject = asyncHandler(async (req, res) => {
  try {
    const {
      user,
      body: { projectName, description },
      params: { groupId },
    } = req;
    if (!projectName || !description)
      throw new Error("All fields are required, kindly fill them all.");

    await Yup.string()
      .label("Project_Name")
      .required(true)
      .min(3)
      .max(30)
      .validate(projectName);
    await Yup.string()
      .label("Project_Description")
      .required(true)
      .min(10)
      .max(300)
      .validate(description);

    if (await Project.findOne({ projectName, groupId }))
      throw new Error("Project with same name already exist in the project.");

    const newProject = await Project.create({
      projectName,
      description,
      groupId,
      team: {
        leaderId: user._id,
        members: [],
      },
    });

    res.status(201).json({
      success: true,
      message: "New Project Created Successfully.",
      data: newProject,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export const manageProject = asyncHandler(async (req, res) => {
  try {
    const {
      project,
      body: { projectName, description },
    } = req;
    project.$set(
      "projectName",
      projectName ? projectName : project.projectName
    );
    project.$set(
      "description",
      description ? description : project.description
    );
    await project.save();
    res.status(201).json({
      success: true,
      message: "Project updated successfully.",
      data: project,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export const getMyInvitations = asyncHandler(async (req, res) => {
  try {
    const { user } = req;
    const sentInvitations = await Invitation.find({ senderId: user._id });
    const recievedInvitations = await Invitation.find({ recieverId: user._id });
    res
      .status(200)
      .json({ success: true, data: { sentInvitations, recievedInvitations } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export const inviteProjectMember = asyncHandler(async (req, res) => {
  try {
    const {
      user,
      body: { recieverEmail, message },
      params: { groupId, projectId },
    } = req;
    if (!recieverEmail || !message)
      throw new Error("All fields are required, kindly fill them all.");
    const project = await Project.findById(projectId);
    if (!project) {
      res.status(404);
      throw new Error("Project not found.");
    }
    const reciever = await User.findOne({ email: recieverEmail });

    let newInvitation;

    if (!reciever) {
      newInvitation = await Invitation.create({
        senderId: user._id,
        recieverId: null,
        projectId,
        message,
      });

      await newInvitation.save();

      const invitationUrl = `${process.env.BASE_URL}/manage/groups/${groupId}/projects/${projectId}/invitations/${newInvitation._id}/accept`;

      await sendEmail(
        recieverEmail,
        `${project.name} - Invitation`,
        `Hey, ${recieverEmail}, kindly click this link to accept your invitation sent from ${user.email} to join the ${project.projectName} project. Kindly, click the followed link to accept the invitation and join the team ${invitationUrl}`
      );
    }

    newInvitation = await Invitation.create({
      senderId: user._id,
      recieverId: reciever._id,
      projectId,
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
    if (invitation.recieverId.toString() !== user._id.toString()) {
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
