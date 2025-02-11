const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const client = new OAuth2Client(process.env.CLIENT_ID);

exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    // console.log(token);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    });

    const { email, name } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        name,
        credits: 5, 
        timestamp: new Date(),
      });
      await user.save();
      // console.log("New user created:", user.email);
    }

    res.status(200).json({ email: user.email, credits: user.credits });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(401).json({ message: "Invalid Google token" });
  }
};
