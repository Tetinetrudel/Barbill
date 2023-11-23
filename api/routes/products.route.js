import express from 'express'

import { getProducts, getProduct, addProduct, updateProduct, updatePopular, deleteProduct } from '../controllers/products.controller.js'
import { verifyToken } from '../middleware/verifyToken.js'

const router = express.Router()

router.get('/', verifyToken, getProducts)
router.get('/:id', verifyToken, getProduct)
router.post('/', verifyToken, addProduct)
router.patch('/:id', verifyToken, updateProduct)
router.patch('/:id/popular', verifyToken, updatePopular)
router.delete('/:id', verifyToken, deleteProduct)

export default router