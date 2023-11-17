import express from 'express'
import { verifyToken } from '../middleware/verifyToken.js'
import { getClients, addClient } from '../controllers/clients.controller.js'

const router = express.Router()

router.get('/', verifyToken, getClients)
router.post('/', verifyToken, addClient)

export default router