import User from '../models/userModel.js'
import bcrypt from "bcryptjs"
import { generateToken } from '../utils/helpers.js'

export const registerUser = async(req, res) => {
    try {
        const {username, email, password} = req.body
        // TODO: VALIDATE INPUTS
        if(await User.findOne({username}))
            throw new Error("This username is not available, try another one.")
        if(await User.findOne({email}))
            throw new Error("This email is already used, try another one.")

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({username, email, password: hashedPassword})

        res.status(201).json({
            success: true,
            message: "Successfully signed up.",
            data: newUser
        })
    } catch (error) {
        res.status(400).json({success: false, message: error.message})
    }
}

export const loginUser = async(req, res) => {
    try {
        const {email, password} = req.body
        // TODO: VALIDATE INPUTS
        const user = await User.findOne({email})
        if(!user)
            throw new Error("User not found, try sign up.")
        if(user && !await bcrypt.compare(password, user.password))
            throw new Error("Incorrect password.")
        user.token = generateToken(user._id)
        
        res.status(201).json({
            success: true,
            message: "Successfully logged in.",
            data: user
        })
    } catch (error) {
        res.status(400).json({success: false, message: error.message})
    }
}

export const getMe = async(req, res) => {
    try {
        const {user} = req
        res.status(200).json({success: true, data: user})
    } catch (error) {
        res.status(400).json({success: false, message: error.message})
    }
}