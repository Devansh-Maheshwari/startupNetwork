const express = require('express');
const router = express.Router();
const { sendRechargeEmail } = require('../services/emailService');

router.post('/test-email', async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    await sendRechargeEmail(email);
    res.status(200).json({ message: `Test email sent successfully to ${email}` });
  } catch (error) {
    console.error("Error sending test email:", error);
    res.status(500).json({ message: 'Failed to send test email' });
  }
});

module.exports = router;
