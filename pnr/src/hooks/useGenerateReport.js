import { useCallback, useState } from 'react';
import axios from 'axios';

const useGenerateReport = (sessionId, sessionType, token) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [generatedText, setGeneratedText] = useState('');

    const fetchReportData = useCallback(async () => {
        if (!sessionId) {
            console.error("No session selected.");
            return;
        }

        setLoading(true);
        setError(null);

        const baseURL = `/api/${sessionType}Analysis`;

        try {
            const savedResponse = await axios.get(`${baseURL}/${sessionId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (savedResponse.data) {
                setGeneratedText(savedResponse.data.generatedText);
            } else {
                const generalReport = await axios.get(`${baseURL}/report/${sessionId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const detailedAnalysis = await axios.post(`${baseURL}/analyze`, { sessionId }, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const userMessages = await axios.get(`/api/${sessionType}Conversations/userMessages/${sessionId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!generalReport.data || !detailedAnalysis.data.detailedAnalysis || !userMessages.data.messages || userMessages.data.messages.length === 0) {
                    throw new Error('Data for generating AI content is incomplete.');
                }

                const generatedContent = await generateAIContent(generalReport.data, detailedAnalysis.data, userMessages.data);
                setGeneratedText(generatedContent);
            }
        } catch (error) {
            console.error('Error fetching data for AI content generation:', error.response ? error.response.data : error.message);
            setError(error.response ? error.response.data.message : error.message);
        } finally {
            setLoading(false);
        }
    }, [sessionId, sessionType, token]);

    return { loading, generatedText, error, fetchReportData };
};

export default useGenerateReport;
