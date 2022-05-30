const nodemailer = require("nodemailer");

const sendMail = async(sub, body, html) => {
let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: process.env.MAIL_USER, // generated ethereal user
      pass: process.env.MAIL_PASS, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `"FIREMAN" <${process.env.MAIL_USER}>`,
    to: process.env.MAIL_ADMIN, 
    subject: sub,
    text: body,
    html:html
  });

  console.log("Message sent: %s", info.messageId);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

module.exports = sendMail;
