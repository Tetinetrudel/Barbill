import express from 'express'
import { sendEmail } from '../controllers/email.controller.js'

const router = express.Router()

//router.get('/', verifyToken, getCategories)
router.post('/', sendEmail)

export default router