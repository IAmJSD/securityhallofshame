// Defines the Mailgun client.
const mgClient = require("mailgun-js")({
    domain: process.env.DOMAIN,
    apiKey: process.env.MAILGUN_API_KEY,
})

// Sends emails.
module.exports = (subject, content) => new Promise((res, rej) => {
    mgClient.messages().send({
        to: process.env.EMAIL_TO, from: process.env.MAIL_FROM,
        subject, text: content,
    }, err => {
        if (err) rej(err)
        else res()
    })
})
