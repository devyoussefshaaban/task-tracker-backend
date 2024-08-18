import User from "../../models/userModel.js";
import Task from "../../models/taskModel.js";
import asyncHandler from 'express-async-handler'

export const deleteUser = asyncHandler(async(req, res) => {
    try {
        const {params:{userId}} = req
        
        const user = await User.findById(userId)
        
        if(!user) throw new Error("User not found.")

        await Task.deleteMany({userId})
        
        setTimeout(async () => await User.deleteOne({_id: userId}), 1000)

        res.status(201).json({success: true, message: "User has been deleted successfully."})
    } catch (error) {
        res.status(400).json({success: false, message: error.message})
    }
})