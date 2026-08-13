require('dotenv').config()

const nodemailer = require('nodemailer')

const emailPass = (process.env.EMAIL_PASS || '').replace(/\s+/g, '')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: emailPass,
    },
})

if (!emailPass) {
    console.error('EMAIL_PASS is missing. Add your Gmail app password to .env to enable email sending.')
}

// Verify the connection configuration
transporter.verify((error) => {
    if (error) {
        console.error('Error connecting to email server:', error)
        console.error('Email auth is failing. Set EMAIL_PASS to a Gmail app password.')
    } else {
        console.log('Email server is ready to send messages using app password auth')
    }
})

// Function to send email
const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"Backend Ledger" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html,
        })

        console.log('Message sent: %s', info.messageId)
    } catch (error) {
        console.error('Error sending email:', error)
    }
}

async function sendRegisterationEmail(userEmail, name) {
    const subject = 'Welcome to Backend Ledger!'
    const text = `Hello ${name},\n\nThank you for registering with Backend Ledger. We're excited to have you on board!\n\nBest regards,\nThe Backend Ledger Team`
    const html = `<p>Hello ${name},</p><p>Thank you for registering with Backend Ledger. We're excited to have you on board!</p><p>Best regards,<br>The Backend Ledger Team</p>`

    await sendEmail(userEmail, subject, text, html)
}

async function sendTransactionEmail(userEmail, name, amount, toAccount) {
    const subject = 'Transaction Successful'
    const text = `Hello ${name},\n\nYour transaction has been completed successfully.\n\nAmount: ${amount}\nTo Account: ${toAccount}\n\nBest regards,\nThe Backend Ledger Team`
    const html = `<p>Hello ${name},</p><p>Your transaction has been completed successfully.</p><ul><li><strong>Amount:</strong> ${amount}</li><li><strong>To Account:</strong> ${toAccount}</li></ul><p>Best regards,<br>The Backend Ledger Team</p>`

    await sendEmail(userEmail, subject, text, html)
}

async function sendTransactionFailureEmail(userEmail, name, amount, toAccount) {
    const subject = 'Transaction Failed'
    const text = `Hello ${name},\n\nYour transaction could not be completed.\n\nAmount: ${amount}\nTo Account: ${toAccount}\n\nBest regards,\nThe Backend Ledger Team`
    const html = `<p>Hello ${name},</p><p>Your transaction could not be completed.</p><ul><li><strong>Amount:</strong> ${amount}</li><li><strong>To Account:</strong> ${toAccount}</li></ul><p>Best regards,<br>The Backend Ledger Team</p>`

    await sendEmail(userEmail, subject, text, html)
}


module.exports = {
    sendRegisterationEmail,
    sendTransactionEmail,
    sendTransactionFailureEmail
}