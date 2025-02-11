require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/route');
const authroute=require('./routes/authroute')
const { checkForRechargeEmails } = require('./services/gmailService');
const seedData = require('./seedData'); 
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

  mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    // console.log('MongoDB Connected');
    await seedData(); // Seed data after database connection
  })
  .catch(err => console.error('MongoDB Connection Error:', err));

  app.use('/api', routes);
  app.use('/api',authroute)
  // const { sendRechargeEmail } = require('./services/emailService');

// app.use('/test-email', async (req, res) => {
//   const { email } = req.body;

//   if (!email) return res.status(400).json({ message: 'Email is required' });

//   try {
//     await sendRechargeEmail(email);
//     res.status(200).json({ message: `Test email sent successfully to ${email}` });
//   } catch (error) {
//     console.error("Error sending test email:", error);
//     res.status(500).json({ message: 'Failed to send test email' });
//   }
// });
setInterval(checkForRechargeEmails, 60000); // Check for recharge emails every minute

app.listen(5000, () => console.log('Server running on port 5000'));
