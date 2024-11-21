import Project from "../models/projectModel.js";
import asyncHandler from "express-async-handler";
import Yup from "yup";

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
