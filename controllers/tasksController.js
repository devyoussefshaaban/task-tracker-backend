import Task from "../models/taskModel.js";
import User from "../models/userModel.js";
import Project from "../models/projectModel.js";
import Yup from "yup";

export const getMyTasks = async (req, res) => {
  try {
    const { user } = req;
    const tasks = await Task.find().where(
      "creator.userId",
      user._id && "assignee.userId",
      user._id
    );
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const {
      user,
      body: {
        title,
        description,
        startDate,
        endDate,
        priority,
        status,
        projectId,
        assignedUserId,
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

    const task = await Task.findOne({ title }).where(
      "creator.userId",
      user._id
    );
    if (task)
      throw new Error(
        `This task already listed, and it's current status is: ${task.status}`
      );

    const assigneeInfo = assignedUserId
      ? await User.findById(assignedUserId)
      : user;

    const projectInfo = projectId ? await Project.findById(projectId) : null;
    console.log({ projectInfo });

    const newTask = await Task.create({
      creator: {
        userId: user._id,
        username: user.username,
        email: user.email,
      },
      title,
      description,
      startDate,
      endDate,
      priority,
      status,
      project: projectInfo
        ? {
            projectId: projectInfo._id,
            projectName: projectInfo.projectName,
          }
        : null,
      assignee: {
        userId: assigneeInfo._id,
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
};

export const updateTask = async (req, res) => {
  try {
    const {
      user,
      task,
      body: { title, description, status, assignedUserId },
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

    if (assignedUserId) {
      const assignedUserData = User.findById(assignedUserId);

      if (!assignedUserData) {
        res.statsu(404);
        throw new Error("User not found");
      }
      task.$set("assignee.userId", assignedUserId);
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
};

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
