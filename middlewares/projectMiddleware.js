import Group from "../models/groupModel.js";

export const isProjectLeader = async (req, res, next) => {
  try {
    const {
      user,
      params: { projectId },
    } = req;
    const project = await Group.findOne({ _id: projectId });
    if (!project) {
      res.status(404);
      throw new Error("Project not found.");
    }
    if (user._id.toString() !== project.creatorId.toString()) {
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

export const isGroupAdmin = async (req, res, next) => {
  try {
    const {
      user,
      params: { groupId },
    } = req;
    const group = await Group.findOne({ _id: groupId });
    if (!group) {
      res.status(404);
      throw new Error("Project not found.");
    }
    if (user._id.toString() !== group.creatorId.toString()) {
      res.status(403);
      throw new Error(
        "You're not the group leader, you're not permitted to this action."
      );
    }
    req.group = group;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};
