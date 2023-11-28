import Client from '../models/clients.model.js'
import nodemailer from 'nodemailer'
import { readFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const populateEmailTemplate = async (client, templatePath) => {
  try {
    const template = await readFile(templatePath, { encoding: 'utf8' })
    const currentDate = new Date().toLocaleDateString()

    const productsHTML = client.bill.map(product => `
        <div class="grid grid-cols-12 text-xs font-bold">
            <div class="col-span-10 py-1 px-4 flex flex-col gap-1">
                <h3 class="font-semibold text-zinc-900 text-xs">${product.product.name}</h3>
                <p class="text-sm text-zinc-600">${product.AddedAt}</p>
            </div>
            <div class="col-span-2 py-1 px-4">
                <p class="text-sm text-zinc-900">${product.product.price.toFixed(2)} $</p>
            </div>
        </div>
    `).join('')

    const populatedTemplate = template
      .replace('{{billDate}}', currentDate)
      .replace('{{companyAvatar}}', client.user.avatar)
      .replace('{{companyName}}', client.user.company)
      .replace('{{clientName}}', client.name)
      .replace('<!-- {{bill}} -->', productsHTML)

    return populatedTemplate
  } catch (error) {
    console.error('Error populating email template:', error)
    return null
  }
}

export const sendBillEmail = async (req, res) => {
  try {
    const { id } = req.params
    const { clientEmail } = req.body
    const emailTemplatePath = path.join(__dirname, '..', 'public', 'EmailBillTemplate.html')

    const client = await Client.findById(id).populate('user').populate('bill.product')

    const populatedTemplate = await populateEmailTemplate(client, emailTemplatePath)

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'etrudel@gmail.com',
            pass: process.env.EMAIL_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false,
        },
    })

    const mailOptions = {
      from: 'etrudel@gmail.com',
      to: clientEmail,
      subject: 'Your Bill',
      html: populatedTemplate,
    }

    await transporter.sendMail(mailOptions)
    res.status(200).json({ message: 'Bill email sent successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}





