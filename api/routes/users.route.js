import express from 'express'
import { updateUser, changePassword, deleteUser } from '../controllers/users.controller.js'
import { verifyToken } from '../middleware/verifyToken.js'

const router = express.Router()

router.patch('/', verifyToken, updateUser)
router.patch('/change-password', verifyToken, changePassword)
router.delete('/:id', deleteUser)

export default router