import {Router} from 'express'
import { getMe, loginUser, updateMyProfile, registerUser } from '../controllers/authController.js'
import { auth } from '../middlewares/authMiddleware.js'

const router = Router()

router.post("/sign-up", registerUser)
router.post("/sign-in", loginUser)
router.get("/me", auth,getMe)
router.patch("/me/update-profile", auth, updateMyProfile)

export default router