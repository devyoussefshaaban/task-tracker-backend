import {Router} from 'express'
import { deleteUser } from '../../controllers/admin/manageUsersController.js'
import { admin, auth } from '../../middlewares/authMiddleware.js'

const router = Router()

router.delete("/users/:userId", auth, admin, deleteUser)

export default router