import {Schema, model} from 'mongoose'
import { USER_ROLE } from '../utils/constants.js'

const userSchema = new Schema({
    username:{
        type: String,
        required: true,
        minLength: 3,
        maxLength: 30,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        default: USER_ROLE.USER
    },
    token:{
        type: String
    }
}, {
    timestamps: true
})

const User = model("User", userSchema)
export default User