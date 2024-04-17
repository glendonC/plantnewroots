const ReadingSessionAnalysis = require('../models/ReadingSessionAnalysis');

const createAnalysis = async (sessionId, generatedText) => {
  try {
    const analysis = new ReadingSessionAnalysis({
      sessionId,
      generatedText
    });
    await analysis.save();
    return analysis;
  } catch (error) {
    throw new Error('Error creating reading session analysis:', error);
  }
};

const getAnalysisBySessionId = async (sessionId) => {
  try {
    const analysis = await ReadingSessionAnalysis.findOne({ sessionId });
    return analysis;
  } catch (error) {
    throw new Error('Error retrieving reading session analysis:', error);
  }
};

module.exports = {
  createAnalysis,
  getAnalysisBySessionId
};
