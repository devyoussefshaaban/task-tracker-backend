import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateToken, sendEmail } from "../utils/helpers.js";
import Yup from "yup";
import asyncHandler from "express-async-handler";
import Token from "../models/tokenModel.js";
import crypto from "crypto";

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

    const verificationToken = await Token.create({
      userId: newUser._id,
      token: crypto.randomBytes(32).toString("hex"),
    });

    await verificationToken.save();

    const verificationUrl = `${process.env.BASE_URL}/auth/users/${newUser._id}/verify/${verificationToken.token}`;

    await sendEmail(
      newUser.email,
      "Task Tracker - Veify Email",
      `Hey, ${newUser.username}, kindly click this link to verify your account. ${verificationUrl}`
    );

    res.status(201).json({
      success: true,
      message:
        "Verification link has been sent to your email, kindly click it to verify your account.",
      data: newUser,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

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

    if (!user.isVerified) {
      const verificationToken = await Token.findOne({ userId: user._id });

      if (!verificationToken) {
        const newVerificationToken = await Token.create({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        });

        await newVerificationToken.save();

        const verificationUrl = `${process.env.BASE_URL}/auth/users/${user._id}/verify/${newVerificationToken.token}`;

        await sendEmail(
          user.email,
          "Task Tracker - Veify Email",
          `Hey, ${user.username}, kindly click this link to verify your account. ${verificationUrl}`
        );
      }

      throw new Error(
        "You're account is not verified, kindly check out your mail inbox and click the link we sent to verify your account."
      );
    }

    res.status(201).json({
      success: true,
      message: "Successfully logged in.",
      data: {
        username: user.username,
        email: user.email,
        token: user.token,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export const getMe = asyncHandler(async (req, res) => {
  try {
    const { user } = req;
    const { username, email, role } = user;
    res.status(200).json({
      success: true,
      data: {
        username,
        email,
        role,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export const updateMyProfile = asyncHandler(async (req, res) => {
  try {
    const {
      user,
      body: { username, email, password },
    } = req;

    await Yup.string().label("Username").validate(username);
    await Yup.string().email().label("Email").validate(email);
    await Yup.string().label("Password").min(6).validate(password);

    username ? user.$set("username", username) : null;
    email ? user.$set("email", email) : null;
    password ? user.$set("password", await bcrypt.hash(password, 10)) : null;

    await user.save();

    res.json({
      success: true,
      message: "Your profile updated successfully.",
      data: {
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

export const verifyUser = asyncHandler(async (req, res) => {
  try {
    const {
      params: { userId, token },
    } = req;

    const user = await User.findOne({ _id: userId });

    if (!user) throw new Error("User not found.");

    const userToken = await Token.findOne({ userId, token });

    if (!userToken) throw new Error("Token not found.");

    user.$set("isVerified", true);

    await user.save();
    await Token.deleteOne({ token });

    res.status(200).json({
      success: true,
      message: "Your account has been verified successfully.",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
