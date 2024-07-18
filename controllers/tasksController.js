import Task from "../models/taskModel.js";
import Yup from "yup";

export const getMyTasks = async (req, res) => {
  try {
    const { user } = req;
    const tasks = await Task.find({ userId: user._id });
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const {
      user,
      body: { name, description, status },
    } = req;

    await Yup.string()
      .label("Task name")
      .required()
      .min(3)
      .max(30)
      .validate(name);
    await Yup.string()
      .label("Description")
      .required()
      .min(10)
      .max(300)
      .validate(description);

    const task = await Task.findOne({ userId: user._id, name });
    if (task)
      throw new Error(
        `This task already listed, and it's current status is: ${task.status}`
      );

    const newTask = await Task.create({
      name,
      description,
      status,
      userId: user._id,
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
      body: { name, description, status },
    } = req;

    await Yup.string()
      .label("Task name")
      .required()
      .min(3)
      .max(30)
      .validate(name);
    await Yup.string()
      .label("Description")
      .required()
      .min(10)
      .max(300)
      .validate(description);

    const tasksWithSameName = await Task.find({ userId: user._id, name });
    if (tasksWithSameName.length > 1)
      throw new Error(
        `This task already listed, and it's current status is: ${task.status}`
      );

    if (name && name !== task.name) await task.$set("name", name);
    if (description && description !== task.description)
      await task.$set("description", description);
    if (status && status !== task.status) await task.$set("status", status);

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
      task,
      params: { taskId },
    } = req;

    await Task.deleteOne({ _id: taskId });

    res.status(201).json({ success: true, message: "Successfully deleted." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
