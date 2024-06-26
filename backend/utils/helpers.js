import jwt from 'jsonwebtoken'

export const generateToken = (userId) => {
    return jwt.sign({userId}, process.env.JWT_SECRET_KEY, {expiresIn: "1d"})
}