import asyncHandler from "express-async-handler";
import Group from "../models/groupModel.js";
import GroupMember from "../models/group_member.js";
import Yup from "yup";
import Project from "../models/projectModel.js";

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

    await GroupMember.create({
      userData: {
        userId: user._id,
        username: user.username,
        email: user.email,
      },
      groupData: {
        groupId: newGroup._id,
        groupName: newGroup.groupName,
        description: newGroup.description,
      },
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

export const getMyGroups = asyncHandler(async (req, res) => {
  try {
    const { user } = req;
    const groupList = await GroupMember.find().where(
      "userData.userId",
      user._id
    );
    res.status(200).json({ success: true, data: groupList });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export const getGroupById = asyncHandler(async (req, res) => {
  try {
    const {
      params: { groupId },
    } = req;

    const group = await Group.findById(groupId);
    if (!group) {
      res.status(404);
      throw new Error("Group not found.");
    }

    const projects = await Project.find({ groupId: group._id });

    const members = await GroupMember.find().where(
      "groupData.groupId",
      group._id
    );

    res.status(200).json({ success: true, data: { group, projects, members } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export const editGroup = asyncHandler(async (req, res) => {
  try {
    const {
      group,
      body: { groupName, description },
      params: { groupId },
    } = req;
    group.$set("groupName", groupName ? groupName : group.groupName);
    group.$set("description", description ? description : group.description);
    await group.save();
    res.status(201).json({
      success: true,
      message: "Group is updated successfully.",
      data: group,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
