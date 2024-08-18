import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/helpers.js";
import Yup from "yup";
import asyncHandler from 'express-async-handler'

export const registerUser = asyncHandler(async (req, res) => {
  try {
    const { username, email, password } = req.body;

    await Yup.string()
      .label("Username")
      .required()
      .min(3)
      .max(30)
      .validate(username);
    await Yup.string().email().label("Email").required().validate(email);
    await Yup.string().label("Password").required().min(6).validate(password);

    if (await User.findOne({ username }))
      throw new Error("This username is not available, try another one.");
    if (await User.findOne({ email }))
      throw new Error("This email is already used, try another one.");

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Successfully signed up.",
      data: newUser,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
})

export const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    await Yup.string().email().label("Email").required().validate(email);
    await Yup.string().label("Password").required().min(6).validate(password);

    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found, try sign up.");
    if (user && !(await bcrypt.compare(password, user.password)))
      throw new Error("Incorrect password.");
    user.token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Successfully logged in.",
      data: {
        username: user.username,
        email: user.email,
        token: user.token
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
})

export const getMe = asyncHandler(async (req, res) => {
  try {
    const { user } = req;
    const { username, email } = user;
    res.status(200).json({
      success: true,
      data: {
        username,
        email,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
})

export const updateMyProfile = asyncHandler(async (req, res) => {
  try {
    const {user, body:{username,email, password}} = req

    await Yup.string().label("Username").validate(username);
    await Yup.string().email().label("Email").validate(email);
    await Yup.string().label("Password").min(6).validate(password);

    username ? user.$set("username", username) : null;
    email ? user.$set("email", email) : null;
    password ? user.$set("password", await bcrypt.hash(password, 10)) : null;

    await user.save();

    res.json({
      success: true,
      message:"Your profile updated successfully.",
      data: {
        username: user.username,
        email: user.email
      }
    })
  } catch (error) {
    res.json({success: false, message: error.message})
  }
})
