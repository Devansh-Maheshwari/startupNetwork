const mongoose = require('mongoose');
const InvestorMentor = require('./models/InverstorMentor');
const User = require('./models/User');

async function seedData() {
  try {
    // console.log('Starting data seeding...');

    await InvestorMentor.deleteMany();
    await User.deleteMany();

    const investorMentorData = [
      { name: 'Ria', category: 'AI', type: 'Investor' },
      { name: 'Martin', category: 'Blockchain', type: 'Mentor' },
      { name: 'Leo', category: 'EV', type: 'Mentor' },
      { name: 'Zack', category: 'Ecommerce', type: 'Mentor' },
      { name: 'Honia', category: 'Video', type: 'Investor' },
      { name: 'Sophia', category: 'Fintech', type: 'Investor' },
      { name: 'Raj', category: 'Healthcare', type: 'Mentor' },
      { name: 'Elon', category: 'Space Tech', type: 'Investor' },
      { name: 'Ada', category: 'AI Ethics', type: 'Mentor' },
      { name: 'Max', category: 'Energy', type: 'Mentor' },
    ];

    await InvestorMentor.insertMany(investorMentorData);
    // console.log('Investor and Mentor data seeded successfully.');
 } catch (error) {
    console.error('Error seeding data:', error);
  }
}

module.exports = seedData;
