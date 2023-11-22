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
        if(!name || !email) {
            return next(errorHandler(401, `Tous les champs doivent être complétés`))
        }
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

export const updateClient = async (req, res, next) => {
    const { id } = req.params
    const { name, email } = req.body
    try {
        if(!id) {
            return next(errorHandler(409, `Vous devez sélectionner un identifiant valide`))
        }

        const client = await Client.findById(id)
        if(!client) {
            return next(errorHandler(404, `Le client recherché n'existe pas. Veuillez recommencer votre recherche`))
        }

        const existingClient = await Client.findOne({ email })

        if (existingClient && existingClient._id.toString() !== id) {
            return next(errorHandler(409, `Seulement un client peut utiliser le courriel ${email}`))
        }

        client.name = name
        client.email = email

        await client.save()

        res.json(client)
    } catch (error) {
        next(error)
        console.log(error)
    }
}

export const deleteClient = async (req, res, next) => {
    const { id } = req.params
    console.log(id)
    try {
        if(!id) {
            return next(errorHandler(404, `Le client n'existe pas.`))
        }

        await Client.findByIdAndDelete(id)

        res.json({ message: `Client supprimé avec succès `})
    } catch (error) {
        next(error.message)
    }
}