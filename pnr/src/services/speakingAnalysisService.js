import axios from 'axios';

const fetchSpeakingSessions = async () => {
  const response = await axios.get('/api/speaking-sessions');
  return response.data;
};

const fetchSpeakingSessionDetails = async (sessionId) => {
  const response = await axios.get(`/api/speaking-analysis/${sessionId}`);
  return response.data;
};

const saveSpeakingAnalysis = async (conversationId, transcript, responseText, analysis) => {
  const apiResponse = await axios.post('/api/speaking-analysis/save', {
    conversationId,
    transcript,
    response: responseText,
    analysis: {
      generatedText: analysis.generatedText,
      additionalMetrics: analysis.additionalMetrics
    }
  });
  return apiResponse.data;
};

const fetchSavedSpeakingAnalysis = async (sessionId) => {
  const response = await axios.get(`/api/speaking-analysis/fetch/${sessionId}`);
  return response.data;
};

export { fetchSpeakingSessions, fetchSpeakingSessionDetails, saveSpeakingAnalysis, fetchSavedSpeakingAnalysis };
