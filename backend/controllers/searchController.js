const { GoogleGenerativeAI } = require("@google/generative-ai");
const User = require('../models/User');
const InvestorMentor = require('../models/InverstorMentor');
const { sendRechargeEmail } = require('../services/emailService');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

exports.searchInvestorsMentors = async (req, res) => {
  const { query, userEmail } = req.body;

  const user = await User.findOne({ email: userEmail });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (user.credits <= 0) {
    await sendRechargeEmail(userEmail);
    return res.status(403).json({ message: 'Your credits are exhausted. Please check your email to recharge.' });
  }

  const databaseData = await InvestorMentor.find();

  const investorMentorData = databaseData.map(item => ({
    name: item.name,
    category: item.category,
    type: item.type,
  }));

  try {
    const prompt = `You are a helpful startup consultant. A user has asked: "${query}". Based on the following database: ${JSON.stringify(
      investorMentorData
    )}, recommend the best fit by name for their request.`;

    const result = await model.generateContent(prompt);
    console.log(result.response.text())
    const answer = result.response.text() || "No suitable recommendation found.";

    user.credits -= 1;
    await user.save();

    return res.json({ message: answer });
  } catch (error) {
    console.error("Error from Gemini API:", error);
    return res.status(500).json({ message: 'Error processing search request' });
  }
};
