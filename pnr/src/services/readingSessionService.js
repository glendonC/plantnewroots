import axios from 'axios';

const baseUrl = '/api/readingSessions';

// Fetch all reading sessions for the authenticated user
export const fetchReadingSessions = async () => {
    try {
        const response = await axios.get(baseUrl, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch reading sessions:', error);
        throw error;
    }
};

// Save a new reading session
export const saveReadingSession = async (sessionData) => {
    try {
        const response = await axios.post(baseUrl + '/save', sessionData, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        return response.data;
    } catch (error) {
        console.error('Error saving reading session:', error);
        throw error;
    }
};

// Fetch a specific reading session
export const fetchReadingSession = async (sessionId) => {
    try {
        const response = await axios.get(`${baseUrl}/${sessionId}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch reading session:', error);
        throw error;
    }
};
