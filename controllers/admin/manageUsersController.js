import User from "../../models/userModel.js";
import Task from "../../models/taskModel.js";
import asyncHandler from "express-async-handler";
import { USER_ROLE } from "../../utils/constants.js";

export const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({ role: USER_ROLE.USER });

    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export const deleteUser = asyncHandler(async (req, res) => {
  try {
    const {
      params: { userId },
    } = req;

    const user = await User.findById(userId);

    if (!user) throw new Error("User not found.");

    await Task.deleteMany({ userId }).then(
      async () => await User.deleteOne({ _id: userId })
    );

    res
      .status(201)
      .json({ success: true, message: "User has been deleted successfully." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
