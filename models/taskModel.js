import {Schema, model} from 'mongoose'
import { TASK_STATUS } from '../utils/constants.js'

const taskSchema = new Schema({
    name:{
        type: String,
        required: true,
        minLength: 3,
        maxLength: 30,
        unique: true
    },
    description:{
        type: String,
        required: true,
        minLength: 10,
        maxLength: 300,
    },
    status:{
        type: String,
        default: TASK_STATUS.NOT_STARTED
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
})

const Task = model("Task", taskSchema)
export default Task