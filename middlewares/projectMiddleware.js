import Project from "../models/projectModel.js";

export const isProjectLeader = async (req, res, next) => {
  try {
    const {
      user,
      params: { projectId },
    } = req;
    const project = await Project.findOne({ _id: projectId });
    if (!project) {
      res.status(404);
      throw new Error("Project not found.");
    }
    if (user._id.toString() !== project.team.leaderId.toString()) {
      res.status(403);
      throw new Error(
        "You're not the project leader, you're not permitted to this action."
      );
    }
    req.project = project;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};
