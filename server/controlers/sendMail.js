const sgMail = require('@sendgrid/mail')

const sendMail = async (sub, body, html) => {
  console.log('from email sendhng')
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  const msg = {
    to: process.env.MAIL_ADMIN,
    from: `FIREMAN <${process.env.MAIL_USER}>`,
    subject: sub,
  }
  html ? msg.html = html : msg.text = body;
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })
}

module.exports = sendMail;
