import axios from 'axios';

const fetchReadingSessions = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get('/api/reading-sessions', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.data;
};

const fetchReadingSessionDetails = async (sessionId) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`/api/reading-analysis/reading-analysis/${sessionId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.data;
};

const saveReadingAnalysis = async (conversationId, text, analysis) => {
  const token = localStorage.getItem('token');
  const response = await axios.post('/api/reading-analysis/reading-analysis/save', {
    conversationId,
    text,
    analysis: {
      generatedText: analysis.generatedText
    }
  }, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.data;
};

const fetchSavedReadingAnalysis = async (sessionId) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`/api/reading-analysis/reading-analysis/fetch/${sessionId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.data;
};

export { fetchReadingSessions, fetchReadingSessionDetails, saveReadingAnalysis, fetchSavedReadingAnalysis };
