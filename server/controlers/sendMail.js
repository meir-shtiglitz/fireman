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












// const sendMail = async(sub, body, html) => {
//   let transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true,
//     auth: {
//       type: "OAuth2",
//       user: "misternet101@gmail.com",
//       clientId: "000000000000-xxx0.apps.googleusercontent.com",
//       clientSecret: "XxxxxXXxX0xxxxxxxx0XXxX0",
//       refreshToken: "1/XXxXxsss-xxxXXXXXxXxx0XXXxxXXx0x00xxx",
//       accessToken: "ya29.Xx_XX0xxxxx-xX0X0XxXXxXxXXXxX0x",
//       expires: 1484314697598,
//     },
//   });
// let transporter = nodemailer.createTransport({
//     service: 'gmail',
//     host: 'smtp.gmail.com',
//     auth: {
//       type:OAuth2’
// user – user email address (required)
// clientId – is the registered client id of the application
// clientSecret – is the registered client secret of the application
// refreshToken – is an optional refresh token. If it is provided then Nodemailer tries to generate a new access token if existing one expires or fails
// accessToken – is the access token for the user. Required only if refreshToken is not available and there is no token refresh callback specified
// expires – is an optional expiration time for the current accessToken
// accessUrl – is an optional HTTP endpoint for requesting new access tokens. This value defaults to Gmail
//       user: process.env.MAIL_USER, // generated ethereal user
//       pass: process.env.MAIL_PASS, // generated ethereal password
//     },
//   });

// send mail with defined transport object

module.exports = sendMail;
