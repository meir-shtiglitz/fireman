const nodemailer = require("nodemailer");
const { google } = require('googleapis');

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;
const refresh_token = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);
oAuth2Client.setCredentials({ refresh_token })

const sendMail = async (sub, body, html) => {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    let transporter = nodemailer.createTransport({
      service: "gmail",
      // port: 465,
      // secure: true,
      auth: {
        type: "OAuth2",
        user: "misternet101@gmail.com",
        clientId: client_id,
        clientSecret: client_secret,
        refreshToken: refresh_token,
        accessToken: accessToken,
      },
    });

    let info = await transporter.sendMail({
      from: `"FIREMAN" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_ADMIN,
      subject: sub,
      text: body,
      html: html
    });
    
    console.log("Message sent: %s", info);
    
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    
    
  } catch (error) {
    console.log('error send mail:', error)
    return error
  }
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
