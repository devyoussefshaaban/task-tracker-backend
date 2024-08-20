import { Schema, model } from "mongoose";

const tokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
    unique: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 3600, // 1 hour
  },
});

const Token = model("Token", tokenSchema);
export default Token;
