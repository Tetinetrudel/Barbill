import User from '../models/users.model.js'

export const getUsers = async (req, res) => {
    try {
        const users = await User.find().exec().lean()
        if(!users.lenght) {
            return res.status(400).json({ message: `Aucun usager existant` })
        }

        res.status(200).json(users)
    } catch (error) {
        console.log(error)
    }
}

export const getUser = (req, res) => {
    res.send("getting a user")
}

export const addUser = (req, res) => {
    res.send("adding a new user")
}

export const updateUser = (req, res) => {
    res.send("updating a existing user")
}

export const deleteUser = (req, res) => {
    res.send("deleting client")
}