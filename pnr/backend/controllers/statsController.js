const moment = require('moment');
const ListeningAnalysis = require('../models/ListeningAnalysis');
const ReadingAnalysis = require('../models/ReadingAnalysis');
const SpeakingAnalysis = require('../models/SpeakingAnalysis');
const WritingConversationAnalysis = require('../models/WritingConversationAnalysis');

//compute date ranges (helper)
function getDateRange(filter) {
    let start, end;
    switch (filter) {
      case 'today':
        start = moment().startOf('day').toDate();
        end = moment().endOf('day').toDate();
        break;
      case 'week':
        start = moment().startOf('week').toDate();
        end = moment().endOf('week').toDate();
        break;
      case 'month':
        start = moment().startOf('month').toDate();
        end = moment().endOf('month').toDate();
        break;
      case 'all':
      default:
        start = new Date(0);
        end = new Date();
        break;
    }
    console.log(`Date Range for ${filter}: Start = ${start}, End = ${end}`);
    return { start, end };
}

async function getStatistics(dateRange) {
    const pipeline = [
        {
            $match: {
                createdAt: { $gte: dateRange.start, $lte: dateRange.end }
            }
        },
        {
            $group: {
                _id: null,
                count: { $sum: 1 }
            }
        }
    ];

    const speakingCount = await SpeakingAnalysis.aggregate(pipeline);
    const writingCount = await WritingConversationAnalysis.aggregate(pipeline);
    const readingCount = await ReadingAnalysis.aggregate(pipeline);
    const listeningCount = await ListeningAnalysis.aggregate(pipeline);

    return {
        speaking: speakingCount.length > 0 ? speakingCount[0].count : 0,
        writing: writingCount.length > 0 ? writingCount[0].count : 0,
        reading: readingCount.length > 0 ? readingCount[0].count : 0,
        listening: listeningCount.length > 0 ? listeningCount[0].count : 0,
    };
}

exports.handleGetStatistics = async (req, res) => {
    try {
        const dateRange = getDateRange(req.query.timeframe);
        const stats = await getStatistics(dateRange);
        res.json(stats);
    } catch (error) {
        console.error('Failed to fetch statistics:', error);
        res.status(500).json({ error: error.message });
    }
};
