import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { USER_ROLE } from "../utils/constants.js";

export const auth = async (req, res, next) => {
  let token;

  const headerAuth = req.headers.authorization;

  try {
    if (headerAuth && headerAuth.startsWith("Bearer")) {
      token = headerAuth.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      const user = await User.findById(decoded.userId);
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(401);
        throw new Error("Not authorized.");
      }
    } else {
      res.status(403);
      throw new Error("Not authorized, no token.");
    }
  } catch (error) {
    res.status(403).json({ success: false, message: error.message });
  }
};

export const admin = (req, res, next) => {
  try {
    const { user } = req;
    if (user.role !== USER_ROLE.ADMIN && user.role !== USER_ROLE.OWNER)
      throw new Error(
        "You're not an admin, you're not permitted to manage in this area."
      );

    next();
  } catch (error) {
    res.status(403).json({ success: false, message: error.message });
  }
};

export const owner = (req, res, next) => {
  try {
    const { user } = req;
    if (user.role !== USER_ROLE.OWNER)
      throw new Error(
        "You're not an owner, you're not permitted to manage in this area."
      );

    next();
  } catch (error) {
    res.status(403).json({ success: false, message: error.message });
  }
};
