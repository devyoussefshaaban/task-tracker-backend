import { Schema, model } from "mongoose";
import { StringType } from "../utils/helpers.js";

const taskCategorySchema = new Schema({
  categoryName: StringType(3, 20, true, true),
  description: StringType(10, 300, false, true),
});

const TaskCategory = model("TaskCategory", taskCategorySchema);
export default TaskCategory;
