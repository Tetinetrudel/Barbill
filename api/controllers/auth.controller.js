import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { errorHandler } from '../middleware/errorHandler.js'

import User from '../models/users.model.js'

export const register = async (req, res, next) => {
    try {
        const { company, email, password, confirmPassword } = req.body
        if(!company || !email || !password || !confirmPassword) {
            return next(errorHandler(409, 'Tous les champs doivent être complété'))
        }

        const existingUser = await User.findOne({ email }).exec()
        if(existingUser) {
            return next(errorHandler(401, `un usager avec le courriel ${email} existe déjà`))
        }

        if(password !== confirmPassword) {
            return next(errorHandler(400, 'Les deux mot de passe doivent être concident'))
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            company,
            email,
            password: hashPassword
        })

        await newUser.save()

        res.status(200).json({ message: `${company} a été crée avec succès` })
        
    } catch (error) {
        next(error)
    }
}

export const login = async (req, res, next) => {
    const { email, password } = req.body
    try {
        if(!email || !password) return next(errorHandler(400, `Tous les champs doivent être complétés`))
        
        const validUser = await User.findOne({ email })
        if (!validUser) return next(errorHandler(404, `L'usager n'a pas été retrouvé`))

        const validPassword = await bcrypt.compare(password, validUser.password)
        if (!validPassword) return next(errorHandler(401, `Données d'identifications éronnées`))

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET)
        const { password: pass, ...rest } = validUser._doc
        
        res
            .cookie('access_token', token, { httpOnly: true })
            .status(200)
            .json(rest)

        } catch (error) {
        next(error)
        }
  }