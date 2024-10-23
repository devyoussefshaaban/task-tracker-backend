import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { Schema } from "mongoose";

export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
};

export const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: process.env.PORT,
      secure: Boolean(process.env.SECURE),
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.USER_EMAIL,
      to: email,
      subject,
      text,
    });

    console.log("Email sent successfully.");
  } catch (error) {
    console.log(`Email not sent, an ERROR occured: ${error}`);
    return error;
  }
};

export const StringType = (minLength, maxLength, isUnique, isRequired) => {
  return {
    type: String,
    required: isRequired,
    minLength,
    maxLength,
    unique: isUnique,
  };
};

export const modelRefType = (ref) => {
  return {
    type: Schema.ObjectId,
    ref,
  };
};
