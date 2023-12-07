import User from '../models/users.model.js'
import Client from '../models/clients.model.js'
import { Resend } from "resend"
import { errorHandler } from '../middleware/errorHandler.js'

export const sendEmail = async ( req, res, next ) => {
    const resend = new Resend(process.env.RESEND_API_KEY)
    try {
        const { userId, clientId } = req.body
        const user = await User.findById({ _id: userId })
        const client = await Client.findById({ _id: clientId }).populate('bill.product')
        const data = await resend.emails.send({
            from: 'Dek Kia <onboarding@resend.dev>',
            to: client.email,
            subject: "hello world",
            html: htmlTemplate(client, user)
        })
        res.json(data)
    } catch (error) {
        next(errorHandler(500, `Problème lors de l'envoi du message. Veillez recommencer`))
    }
}

const htmlTemplate = (client, user) => {
    const totalBill = client.bill.reduce((sum, product) => sum + product.product.price, 0)
    const productsHTML = client.bill.map(product => `
        <tr>
            <td>
                <p>${product.product.name}</p>
            </td>
            <td>
                <p>${product.product.price} $</p>
            </td>
        </tr>`)

    return (`
        <div style="display: flex; width: 100%;">
            <img src="${user.avatar}" width="100px" />
        </div> 
        <div>
            <p><span style="font-size: 20px; color: blue;">${client.name}</span>
            <p>Votre compte est actuellement en souffrance de {{# de jour}}<p>
        </div>
        <table width="300px">
            <thead>
                <tr>
                    <th style="text-align: left;">Produit</th>
                    <th style="text-align: left;">Prix</th>
                </tr>
            </thead>
            <tbody>
                ${productsHTML}
                <tr>
                    <td>
                        <strong>Montant total dû</strong>
                    </td>
                    <td>
                        <strong>${totalBill} $</strong>
                    </td>
                </tr>
            </tbody>
        </table>
        <div>
            <p>Vous pouvez payer directement au centre de dek</p>
            <p>ou faire une virement interac au courriel suivant: ${user.email}</p>
        </div>
        `
    )
}