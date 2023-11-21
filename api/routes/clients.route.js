import express from 'express'
import { verifyToken } from '../middleware/verifyToken.js'
import { getClients, addClient, deleteClient } from '../controllers/clients.controller.js'

const router = express.Router()

router.get('/', verifyToken, getClients)
router.post('/', verifyToken, addClient)
router.delete('/:id', verifyToken, deleteClient)

export default router