const StatisticsService = require('../services/StatisticsService');

const getStatistics = async (req, res) => {
    try {
        const statistics = await StatisticsService.fetchAllStatistics();
        res.json(statistics);
    } catch (error) {
        res.status(500).send({ message: "Failed to fetch statistics", error: error.toString() });
    }
};

module.exports = {
    getStatistics
};
