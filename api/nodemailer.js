import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'etrudel@gmail.com',
    pass: process.env.EMAIL_PASSWORD,
  },
})

export default transporter
