import User from '../models/users.model.js'
import { errorHandler } from '../middleware/errorHandler.js'

import bcrypt from 'bcrypt'

export const updateUser = async (req, res, next) => {
    const { company, email, avatar } = req.body
    const { id } = req.user
    try {
        const user = await User.findById(id).exec()

        if (!user) {
            return next(errorHandler(400, `L'usager n'a pas été trouvé`))
        }

        const duplicate = await User.findOne({ email }).collation({ locale: 'en', strength: 2 }).lean().exec()

        if (duplicate && duplicate?._id.toString() !== id) {
            return next(errorHandler(409, `Le courriel que vous tenté d'entrer existe déjà`))
        }

        user.company = company
        user.email = email

        if(!avatar) {
            user.avatar = user.avatar
        } else {
            user.avatar = avatar
        }

        user.password = user.password


    const updatedUser = await user.save()

    const { password, ...rest } = updatedUser._doc
    res.json(rest)
    } catch (error) {
        next(error)
    }
}

export const changePassword = async (req, res, next) => {
    const { id } = req.user
    const { password } = req.body
    try {
        const user = await User.findById(id).exec()
        if (!user) {
            return next(errorHandler(400, `L'usager n'a pas été trouvé`))
        }

        user.company = user.company
        user.email = user.email
        user.avatar = user.avatar
        user.password = await bcrypt.hash(password, 10)

        await user.save()

        res.json({ message: 'Mot de passe modifié' })
    } catch (error) {
        next(error)
    }
}
export const deleteUser = (req, res) => {
    res.send("deleting client")
}