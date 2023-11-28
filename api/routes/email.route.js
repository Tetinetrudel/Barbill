import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { sendBillEmail } from '../controllers/email.controller.js'

const router = express.Router()

const __dirname = path.dirname(fileURLToPath(import.meta.url))

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/EmailBillTemplate.html'));
})

router.post('/:id', sendBillEmail)

export default router