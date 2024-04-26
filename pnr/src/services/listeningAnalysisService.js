import axios from 'axios';

const fetchListeningSessions = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get('/api/listening-sessions', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.data;
};

const fetchListeningSessionDetails = async (sessionId) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`/api/listening-analysis/listening-analysis/${sessionId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.data;
};

const saveListeningAnalysis = async (conversationId, text, analysis) => {
  const token = localStorage.getItem('token');
  const response = await axios.post('/api/listening-analysis/listening-analysis/save', {
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

const fetchSavedListeningAnalysis = async (sessionId) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`/api/listening-analysis/listening-analysis/fetch/${sessionId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.data;
};

export { fetchListeningSessions, fetchListeningSessionDetails, saveListeningAnalysis, fetchSavedListeningAnalysis };
