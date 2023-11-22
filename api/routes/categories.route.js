import express from 'express'
import { getCategories, addCategory } from '../controllers/categories.controller.js'
import { verifyToken } from '../middleware/verifyToken.js'

const router = express.Router()

router.get('/', verifyToken, getCategories)
router.post('/', verifyToken, addCategory)

export default router