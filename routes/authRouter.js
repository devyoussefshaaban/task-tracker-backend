import {Router} from 'express'
import { getMe, loginUser, registerUser } from '../controllers/authController.js'
import { auth } from '../middlewares/authMiddleware.js'

const router = Router()

router.post("/sign-up", registerUser)
router.post("/sign-in", loginUser)
router.get("/me", auth,getMe)

export default router