require('dotenv').config();
const imaps = require('imap-simple');
const { google } = require('googleapis');
const User = require('../models/User');
const { sendRefusalEmail } = require('./emailService');

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const refreshToken = process.env.REFRESH_TOKEN;
const emailAddress = process.env.EMAIL;

async function getXOAuth2Token() {
  try {
    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    const accessToken = await oauth2Client.getAccessToken();
    if (!accessToken.token) {
      throw new Error("Failed to generate OAuth2 access token");
    }

    return Buffer.from(
      `user=${emailAddress}\x01auth=Bearer ${accessToken.token}\x01\x01`
    ).toString('base64');
  } catch (error) {
    console.error('Error generating OAuth2 token:', error.message || error);
    throw error;
  }
}

async function checkForRechargeEmails() {
  try {
    const xoauth2Token = await getXOAuth2Token();

    const config = {
      imap: {
        user: emailAddress,
        xoauth2: xoauth2Token,
        host: 'imap.gmail.com',
        port: 993,
        tls: true,
        tlsOptions: { rejectUnauthorized: false },
      },
    };

    const connection = await imaps.connect(config);
    await connection.openBox('INBOX');

    const searchCriteria = [['UNSEEN'], ['HEADER', 'SUBJECT', 'recharge 5 credits']];
    const fetchOptions = { bodies: ['HEADER'], markSeen: false };

    const messages = await connection.search(searchCriteria, fetchOptions);

    for (const message of messages) {
      const header = message.parts[0].body;
      const fromHeader = header.from[0];
      const userEmail = fromHeader.match(/<(.+)>/)[1];

      const user = await User.findOne({ email: userEmail });

      if (user) {
        if (user.hasRecharged) {
          await sendRefusalEmail(userEmail);
          // console.log(`Recharge request denied for ${userEmail} (already recharged)`);
        } else {
          user.credits = 5;
          user.hasRecharged = true;
          await user.save();
          // console.log(`Recharged 5 credits for ${userEmail}`);
        }
      }

      const messageUid = message.attributes.uid;
      await connection.addFlags(messageUid, ['\\Seen']);
    }

    connection.end();
  } catch (error) {
    console.error('Error checking recharge emails:', error.message || error);
  }
}

module.exports = { checkForRechargeEmails };
