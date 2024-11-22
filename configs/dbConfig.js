import mongoose, { connect } from "mongoose";

export const connectDB = async () => {
  try {
    await connect(process.env.MONGO_URI, {});
  } catch (error) {
    throw new Error(`DB connection error: ${error}`);
  }
};
