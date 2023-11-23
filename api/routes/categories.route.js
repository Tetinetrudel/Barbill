import express from 'express'
import { getCategories, addCategory, deleteCategory } from '../controllers/categories.controller.js'
import { verifyToken } from '../middleware/verifyToken.js'

const router = express.Router()

router.get('/', verifyToken, getCategories)
router.post('/', verifyToken, addCategory)
router.delete('/', verifyToken, deleteCategory)

export default router