import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

export const fetchConversations = async (token) => {
  return axios.get(`${BASE_URL}/writingConversations`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
};

export const fetchAnalysis = async (conversationId, token) => {
  return axios.get(`${BASE_URL}/writingAnalysis/${conversationId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
};
