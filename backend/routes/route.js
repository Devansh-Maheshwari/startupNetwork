const express = require('express');
const router = express.Router();
const { searchInvestorsMentors } = require('../controllers/searchController');

router.post('/search', searchInvestorsMentors);

module.exports = router;
