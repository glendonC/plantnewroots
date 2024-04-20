import axios from 'axios';

const fetchReadingSessions = async () => {
  const response = await axios.get('/api/reading-sessions');
  return response.data;
};

const fetchReadingSessionDetails = async (sessionId) => {
  const response = await axios.get(`/api/reading-analysis/reading-analysis/${sessionId}`);
  return response.data;
};

const saveReadingAnalysis = async (conversationId, text, analysis) => {
  const response = await axios.post('/api/reading-analysis/reading-analysis/save', {
    conversationId,
    text,
    analysis: {
      generatedText: analysis.generatedText
    }
  });
  return response.data;
};

const fetchSavedReadingAnalysis = async (sessionId) => {
  const response = await axios.get(`/api/reading-analysis/reading-analysis/fetch/${sessionId}`);
  return response.data;
};

export { fetchReadingSessions, fetchReadingSessionDetails, saveReadingAnalysis, fetchSavedReadingAnalysis };
