import axios from 'axios';

const baseUrl = '/api/writingAnalysis';

// Fetch general report for a specific writing conversation
export const fetchGeneralReport = async (conversationId) => {
    try {
        const response = await axios.get(`${baseUrl}/report/${conversationId}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch general report:', error);
        throw error;
    }
};

// Fetch detailed analysis for a specific writing conversation
export const fetchDetailedAnalysis = async (conversationId) => {
    try {
        const response = await axios.post(`${baseUrl}/analyze`, { conversationId }, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        return response.data.detailedAnalysis;
    } catch (error) {
        console.error('Failed to fetch detailed analysis:', error);
        throw error;
    }
};

// Save generated text
export const saveGeneratedText = async (conversationId, generatedText) => {
    try {
        const response = await axios.post(`${baseUrl}/saveGeneratedText`, {
            conversationId,
            generatedText
        }, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        return response.data;
    } catch (error) {
        console.error('Error saving generated text:', error);
        throw error;
    }
};
