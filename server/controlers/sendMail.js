const sgMail = require('@sendgrid/mail')

const sendMail = async (sub, body, html, to, attachments) => {
  console.log('from email sendhng')
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  const msg = {
    to: to || process.env.MAIL_ADMIN,
    from: `FIREMAN <${process.env.MAIL_USER}>`,
    subject: sub,
  }
  html ? msg.html = html : msg.text = body;

  if (attachments && attachments.length > 0) {
    msg.attachments = attachments.map(att => ({
      content: att.content,
      filename: att.filename,
      type: att.contentType,
      disposition: 'attachment'
    }));
  }

  return sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
      throw error;
    })
}

module.exports = sendMail;
