export const isGroupCreator = async (req, res, next) => {
  const {
    user,
    params: { groupId },
  } = req;
  const group = await Group.findById(groupId);
  if (!group) {
    res.status(404);
    throw new Error("Group not found.");
  }
  if (user._id !== group.creatorId) {
    res.status(401);
    throw new error(
      "You're not the group creator, you're not permitted to this action."
    );
  }
  req.group = group;
  next();
};
