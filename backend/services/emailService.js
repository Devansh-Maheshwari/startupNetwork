const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

async function sendEmail(userEmail, subject, text) {
  try {
    const accessToken = await oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });
  
    const mailOptions = {
      from: `"Startup-Platform" <${process.env.EMAIL}>`,
      to: userEmail,
      subject: subject,
      text: text,
    };

    await transporter.sendMail(mailOptions);
    // console.log(`Email sent to ${userEmail} with subject: "${subject}"`);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}

async function sendRechargeEmail(userEmail) {
  await sendEmail(
    userEmail,
    "Recharge Credits Request",
    `Your credits are exhausted. Please send an email to ${process.env.EMAIL} with the subject "recharge 5 credits" to get more credits.`
  );
}

async function sendRefusalEmail(userEmail) {
  await sendEmail(
    userEmail,
    "Recharge Request Denied",
    "Sorry, we are not offering additional credits at this time."
  );
}

module.exports = { sendRechargeEmail, sendRefusalEmail };
