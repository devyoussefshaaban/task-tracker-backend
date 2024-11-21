import Task from "../../models/taskModel.js";
import User from "../../models/userModel.js";
import Invitation from "../../models/invitationModel.js";
import Token from "../../models/tokenModel.js";
import asyncHandler from "express-async-handler";
import { USER_ROLE } from "../../utils/constants.js";

export const clearDB = asyncHandler(async (req, res) => {
  try {
    if (
      (await Task.find()).length === 0 &&
      (await Token.find()).length === 0 &&
      (await User.find({ role: USER_ROLE.USER })).length === 0
    )
      throw new Error("DB is already empty.");

    await Task.deleteMany();
    await Token.deleteMany();
    await User.deleteMany({ role: USER_ROLE.USER });

    res
      .status(201)
      .json({ success: true, message: "DB is successfully cleared." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export const clearInvitations = asyncHandler(async (req, res) => {
  try {
    await Invitation.deleteMany();
    res.status(201).json({
      success: true,
      message: "Invitations list cleared successfully.",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export const deleteUser = asyncHandler(async (req, res) => {
  try {
    const {
      params: { userId },
    } = req;

    const user = await User.findOne({ _id: userId });
    if (!user) throw new Error("User not found.");

    await User.deleteOne({ _id: userId });

    res
      .status(201)
      .json({ success: true, message: "Admin user successfully deleted." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
