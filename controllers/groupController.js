import asyncHandler from "express-async-handler";
import Group from "../models/groupModel.js";
import Yup from "yup";

export const createNewGroup = asyncHandler(async (req, res) => {
  try {
    const {
      user,
      body: { groupName, description },
    } = req;

    if (!groupName || !description)
      throw new Error("All fields are required, kindly fill them all.");

    await Yup.string()
      .label("Group_Name")
      .required(true)
      .min(3)
      .max(30)
      .validate(groupName);
    await Yup.string()
      .label("Group_Description")
      .required(true)
      .min(10)
      .max(300)
      .validate(description);

    const isExistWithSameName = await Group.findOne({
      creatorId: user._id,
      groupName,
    });

    if (isExistWithSameName)
      throw new Error(
        "You have an existed group with the same name, try another name."
      );

    const newGroup = await Group.create({
      creatorId: user._id,
      groupName,
      description,
    });

    res.status(201).json({
      success: true,
      message: "New Group Created Successfully.",
      data: newGroup,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
