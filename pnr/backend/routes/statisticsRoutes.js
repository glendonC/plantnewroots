const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/StatisticsController');

router.get('/', statisticsController.getStatistics);

module.exports = router;
