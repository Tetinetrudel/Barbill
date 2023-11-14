import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

import { corsOptions } from './config/corsOptions.js';
import { connectDB } from './config/connectDb.js';

dotenv.config()

connectDB()

const app = express()

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`))
})