import mongoose, { connect } from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await connect(process.env.MONGO_URI, {})
        console.log(`DB is established on host: ${conn.connection.host}`)
    } catch (error) {
        console.log(`DB connection error: ${error}`)
    }
}