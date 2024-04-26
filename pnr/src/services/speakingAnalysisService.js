import axios from 'axios';

export const fetchSpeakingSessions = async () => {
  try {
    const response = await axios.get('/api/speaking-sessions', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch speaking sessions:', error);
    throw error;
  }
};

export const fetchSpeakingSession = async (conversationId) => {
  try {
    const response = await axios.get(`/api/speaking-sessions/${conversationId}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch speaking session:', error);
    throw error;
  }
};

export const fetchSpeakingSessionDetails = async (conversationId) => {
  try {
    const response = await axios.get(`/api/speaking-analysis/details/${conversationId}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch speaking session details:', error);
    throw error;
  }
};

export const saveSpeakingAnalysis = async (conversationId, transcript, responseText, generatedText) => {
  const response = await axios.post(`/api/speaking-analysis/save/${conversationId}`, {
    transcript,
    responseText,
    generatedText
  }, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
  });
  return response.data;
};



export const fetchSavedSpeakingAnalysis = async (conversationId) => {
  try {
    const response = await axios.get(`/api/speaking-analysis/fetch/${conversationId}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.error('Analysis not found:', error);
      return null;
    } else {
      console.error('Failed to fetch speaking analysis:', error);
      throw error;
    }
  }
};

export const saveGeneratedText = async (conversationId, generatedText) => {
  try {
    const response = await axios.post('/api/speaking-analysis/saveGeneratedText', {
      conversationId,
      generatedText
    }, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });
    console.log('Generated text saved successfully');
    return response.data;
  } catch (error) {
    console.error('Error saving generated text:', error);
    throw error;
  }
};
