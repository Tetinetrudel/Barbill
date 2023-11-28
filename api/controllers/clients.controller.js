import Client from '../models/clients.model.js'
import Product from '../models/products.model.js'
import { errorHandler } from '../middleware/errorHandler.js'

export const getClients = async (req, res, next) => {
    const { id } = req.user
    try {
        const clients = await Client.find({ user: id}).populate('bill.product').populate('cards.product')
        if(clients.lenght === 0) {
            return next(errorHandler(404, 'Aucun client trouvé'))
        }

        res.json(clients)
    } catch (error) {
        next(error)
    }
}

export const getClient = async (req, res, next) => {
    const { id } = req.params
    try {
        const client = await Client.findById(id).populate('bill.product').populate('cards.product')
        if(!client) {
            return next(errorHandler(404, 'Aucun client trouvé'))
        }

        res.json(client)
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

        const client = await Client.findById(id).populate('bill.product').populate('cards.product')
        if(!client) {
            return next(errorHandler(404, `Le client recherché n'existe pas. Veuillez recommencer votre recherche`))
        }

        const existingClient = await Client.findOne({ email })

        if (existingClient && existingClient._id.toString() !== id) {
            return next(errorHandler(409, `Seulement un client peut utiliser le courriel ${email}`))
        }

        client.name = name
        client.email = email

        let updatedClient = await client.save()
        updatedClient = await updatedClient.populate('bill.product')
        updatedClient = await updatedClient.populate('cards.product')

        res.json(updatedClient)
    } catch (error) {
        next(error)
        console.log(error)
    }
}

export const addProductToBill = async (req, res, next) => {
    const { productId } = req.body
    const { id } = req.params
    try {
        const client = await Client.findById(id).populate('bill.product').populate('cards.product')
        const product = await Product.findById(productId)

        if (!client || !product) {
          return next(errorHandler(404, `Aucun client ou produit retrouvé.`))
        }

        if (client.user.toString() !== req.user.id) {
          return next(errorHandler(403, `Non autorisé. Vous n'êtes autorisé à modifier ce client`))
        }

        client.bill.push({ product: productId, addedAt: Date.now() })
        client.status = true

        if (product.name.toLowerCase().includes('carte')) {
          client.cards.push({ product: productId, count: 10 })
        }

        let updatedClient = await client.save()
        updatedClient = await updatedClient.populate('bill.product')
        updatedClient = await updatedClient.populate('cards.product')

        res.json(updatedClient)
    } catch (error) {
        next(error)
    }
}

export const removeProductFromBill = async (req, res) => {
    const { id } = req.params
    const { productId } = req.body
    try {
        const client = await Client.findById(id)

        if (!client) {
            return next(errorHandler(404, `Auncun client trouvé`))
        }

        client.bill.pull({ _id: productId})

        if(client.bill.length === 0) {
            client.status = false
        }

        let updatedClient = await client.save()
        updatedClient = await updatedClient.populate('bill.product')
        updatedClient = await updatedClient.populate('cards.product')

        res.json(client)
    } catch (error) {
        console.error('Erreur lors de la connexion', error.message)
        next(error)
    }
}

export const deleteClient = async (req, res, next) => {
    const { id } = req.params
    try {

        const client = await Client.findById(id)
        if(!client) {
            return next(errorHandler(404, `Le client n'existe pas.`))
        }

        if(client.bill.length > 0) {
            return next(errorHandler(409, `${client.name} a encore des produits à payer.`))
        }

        //if(client.cards.length > 0) {
        //    return next(errorHandler(409, `${client.name} a encore des cartes à utiliser.`))
        //}
        

        await Client.findByIdAndDelete(id)

        res.json({ message: `Le client a été supprimé avec succès `})
    } catch (error) {
        console.log(error)
        next(error.message)
    }
}

export const decreaseCount = async (req, res, next) => {
    const { id } = req.params
    const { cardId } = req.body
    try {
        const client = await Client.findById(id)

        if (!client) {
            return next(errorHandler(404, `Le client n'a pas été trouvé`))
        }

        const cardIndex = client.cards.findIndex(card => card._id == cardId)

        if (cardIndex === -1) {
            return next(errorHandler(404, `Aucune carte trouvé`))
        }

        if (client.cards[cardIndex].count > 0) {
            client.cards[cardIndex].count -= 1
        }

        //if (client.cards[cardIndex].count === 0) {
            //  client.cards.splice(cardIndex, 1);
        //}
    
        let updatedClient = await client.save()
        updatedClient = await updatedClient.populate('bill.product')
        updatedClient = await updatedClient.populate('cards.product')

        res.json(updatedClient)
    } catch (error) {
        next(error)
    }
}

export const increaseCount = async (req, res, next) => {
    const { id } = req.params
    const { cardId } = req.body
    try {
        const client = await Client.findById(id)
        if (!client) {
            return next(errorHandler(404, `Le client n'a pas été trouvé`))
        }
  
        const cardIndex = client.cards.findIndex(card => card._id == cardId)
        if (cardIndex === -1) {
            return next(errorHandler(404, `Aucune carte trouvé`))
        }
  
        if (client.cards[cardIndex].count >= 0) {
            client.cards[cardIndex].count += 1
        }
     
        let updatedClient = await client.save()
        updatedClient = await updatedClient.populate('bill.product')
        updatedClient = await updatedClient.populate('cards.product')
  
      res.json(updatedClient)
    } catch (error) {
          console.error('Erreur lors de la connexion', error)
          res.status(500).json({ message: 'Problème interne au server' })
    }
}