const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

router.get('/statistics', statsController.handleGetStatistics);

module.exports = router;
