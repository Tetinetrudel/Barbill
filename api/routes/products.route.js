import express from 'express'

import { getProducts, addProduct, updateProduct, deleteProduct } from '../controllers/products.controller.js'
import { verifyToken } from '../middleware/verifyToken.js'

const router = express.Router()

router.get('/', verifyToken, getProducts)
router.post('/', verifyToken, addProduct)
router.patch('/:id', verifyToken, updateProduct)
router.delete('/:id', verifyToken, deleteProduct)

export default router