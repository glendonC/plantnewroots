import axios from 'axios';

const fetchReadingSessions = async () => {
  const response = await axios.get('/api/reading-sessions');
  return response.data;
};

const fetchReadingSessionDetails = async (sessionId) => {
  const response = await axios.get(`/api/reading-analysis/${sessionId}`);
  return response.data;
};

export { fetchReadingSessions, fetchReadingSessionDetails };
