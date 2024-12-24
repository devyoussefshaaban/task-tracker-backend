import Task from "../models/taskModel.js";
import User from "../models/userModel.js";
import Project from "../models/projectModel.js";
import TaskCategory from "../models/taskCategoryModel.js";
import asyncHandler from "express-async-handler";
import Yup from "yup";
import { TASK_STATUS } from "../utils/constants.js";

export const getMyTasks = asyncHandler(async (req, res) => {
  try {
    const { user } = req;
    // TODO: Return All Tasks Except the UPCOMING
    const currentTasks = await Task.find().where({
      "creator._id": user._id,
      "assignee._id": user._id,
    });
    // .getFilter("status", !TASK_STATUS.UPCOMING);
    // TODO: Filter & get the upcoming tasks handling Based on the date
    const upcomingTasks = await Task.find().where({
      "creator._id": user._id,
      "assignee._id": user._id,
      status: TASK_STATUS.UPCOMING,
    });
    res
      .status(200)
      .json({ success: true, data: { currentTasks, upcomingTasks } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export const createTask = asyncHandler(async (req, res) => {
  try {
    const {
      user,
      body: {
        title,
        description,
        status,
        priority,
        startDateTime,
        endDateTime,
        projectId,
        categoryId,
        assigneeId,
      },
    } = req;

    await Yup.string()
      .label("Task title")
      .required()
      .min(3)
      .max(30)
      .validate(title);
    await Yup.string()
      .label("Description")
      .required()
      .min(10)
      .max(300)
      .validate(description);

    const task = await Task.findOne({ title }).where("creator._id", user._id);
    if (task)
      throw new Error(
        `This task already listed, and it's current status is: ${task.status}`
      );

    const assigneeInfo = assigneeId ? await User.findById(assigneeId) : user;

    const projectInfo = projectId ? await Project.findById(projectId) : null;

    const categoryInfo = categoryId
      ? await TaskCategory.findById(categoryId)
      : null;

    const newTask = await Task.create({
      title,
      description,
      status,
      priority,
      startDateTime,
      endDateTime,
      project: projectInfo
        ? {
            _id: projectInfo._id,
            projectName: projectInfo.projectName,
          }
        : null,
      category: categoryInfo
        ? {
            _id: categoryInfo._id,
            categoryName: categoryInfo.categoryName,
            description: categoryInfo.description,
          }
        : null,
      creator: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
      assignee: {
        _id: assigneeInfo._id,
        username: assigneeInfo.username,
        email: assigneeInfo.email,
      },
    });

    res.status(201).json({
      success: true,
      message: "Successfully created.",
      data: newTask,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export const updateTask = asyncHandler(async (req, res) => {
  try {
    const {
      user,
      task,
      body: { title, description, status, assigneeId },
    } = req;

    await Yup.string()
      .label("Task title")
      .required()
      .min(3)
      .max(30)
      .validate(title);
    await Yup.string()
      .label("Description")
      .required()
      .min(10)
      .max(300)
      .validate(description);

    if (
      (await Task.find({ title }).where("creator.userId", user._id)).length > 1
    )
      throw new Error(
        `This task already listed, and it's current status is: ${task.status}`
      );

    if (title && title !== task.title) await task.$set("title", title);

    if (description && description !== task.description)
      await task.$set("description", description);

    if (status && status !== task.status) await task.$set("status", status);

    if (assigneeId) {
      const assignedUserData = User.findById(assigneeId);

      if (!assignedUserData) {
        res.statsu(404);
        throw new Error("User not found");
      }
      task.$set("assignee.userId", assigneeId);
      task.$set("assignee.username", assignedUserData.username);
      task.$set("assignee.email", assignedUserData.email);
    }

    await task.save();

    res.status(201).json({
      success: true,
      message: "Successfully updated",
      data: task,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export const deleteTask = async (req, res) => {
  try {
    const {
      params: { taskId },
    } = req;

    await Task.deleteOne({ _id: taskId });

    res.status(201).json({ success: true, message: "Successfully deleted." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getTaskById = asyncHandler(async (req, res) => {
  try {
    const {
      params: { taskId },
    } = req;
    const task = await Task.findById(taskId);
    if (!task) {
      res.status(404);
      throw new Error("Task not found.");
    }
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
