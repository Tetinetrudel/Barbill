import express from 'express'
import { verifyToken } from '../middleware/verifyToken.js'
import { 
    getClients, 
    getClient, 
    addClient, 
    updateClient, 
    deleteClient, 
    addProductToBill, 
    removeProductFromBill,
    decreaseCount,
    increaseCount
} from '../controllers/clients.controller.js'

const router = express.Router()

router.get('/', verifyToken, getClients)
router.get('/', verifyToken, getClient)
router.post('/', verifyToken, addClient)
router.patch('/:id', verifyToken, updateClient)
router.patch('/:id/add', verifyToken, addProductToBill)
router.patch('/:id/remove', verifyToken, removeProductFromBill)
router.patch('/:id/decrease', verifyToken, decreaseCount)
router.patch('/:id/increase', verifyToken, increaseCount)
router.delete('/:id', verifyToken, deleteClient)

export default router