import axios from 'axios';

const fetchListeningSessions = async () => {
  const response = await axios.get('/api/listening-sessions');
  return response.data;
};

const fetchListeningSessionDetails = async (sessionId) => {
  const response = await axios.get(`/api/listening-analysis/listening-analysis/${sessionId}`);
  return response.data;
};

const saveListeningAnalysis = async (conversationId, text, analysis) => {
  const response = await axios.post('/api/listening-analysis/listening-analysis/save', {
    conversationId,
    text,
    analysis: {
      generatedText: analysis.generatedText
    }
  });
  return response.data;
};

const fetchSavedListeningAnalysis = async (sessionId) => {
  const response = await axios.get(`/api/listening-analysis/listening-analysis/fetch/${sessionId}`);
  return response.data;
};

export { fetchListeningSessions, fetchListeningSessionDetails, saveListeningAnalysis, fetchSavedListeningAnalysis };
