import Client from '../models/clients.model.js'
import { errorHandler } from '../middleware/errorHandler.js'

export const getClients = async (req, res, next) => {
    const { id } = req.user
    try {
        const clients = await Client.find({ user: id})
        if(clients.lenght === 0) {
            return next(errorHandler(404, 'Aucun client trouvé'))
        }

        res.json(clients)
    } catch (error) {
        next(error)
    }
}

export const addClient = async (req, res, next) => {
    const { name, email } = req.body
    const { id } = req.user 
    try {
        const existingClient = await Client.findOne({ email })
        if(existingClient) {
            return next(errorHandler(409, `Un client avec le courriel ${email} existe déjà`))
        }

        const newClient = new Client({
            user: id,
            name,
            email
        })

        const response = await newClient.save()

        if(!response) {
            return next(errorHandler(400, `Erreur lors de la création de ${name}. Veuillez recommencer SVP!`))
        }

        res.json(response)
    } catch (error) {
        next(error)
    }
}