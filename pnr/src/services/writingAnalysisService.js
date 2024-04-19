import axios from 'axios';

export const fetchGeneralWritingReport = async (conversationId) => {
  try {
    const response = await axios.get(`/api/analysis/report/${conversationId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    console.log("General Writing Report Data:", response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch general writing report:', error);
    throw error;
  }
};

export const fetchDetailedWritingAnalysis = async (conversationId) => {
  try {
    const response = await axios.post('/api/analysis/analyze', { conversationId }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    console.log("Detailed Analysis Data:", response.data);
    return response.data.detailedAnalysis;
  } catch (error) {
    console.error('Failed to fetch detailed analysis:', error);
    throw error;
  }
};

export const fetchUserWritingMessages = async (conversationId) => {
  try {
    const response = await axios.get(`/api/writingConversations/userMessages/${conversationId}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });
    console.log("User Messages:", response.data);

    if (!response.data || !response.data.messages) {
      throw new Error('No messages found in the response data');
    }

    return response.data.messages;
  } catch (error) {
    console.error('Failed to fetch user messages:', error);
    throw error;
  }
};

export const fetchSavedReport = async (conversationId) => {
  try {
    const response = await axios.get(`/api/analysis/${conversationId}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });
    console.log("Saved Writing Report Data:", response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch saved writing report:', error);
    return null;
  }
};

export const saveGeneratedText = async (conversationId, generatedText) => {
  try {
    await axios.post('/api/analysis/saveGeneratedText', {
      conversationId,
      generatedText
    }, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });
    console.log('Generated text saved successfully');
  } catch (error) {
    console.error('Error saving generated text:', error);
    throw error;
  }
};