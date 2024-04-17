import { useState } from 'react';
import axios from 'axios';

const useGenerateReport = (token) => {
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const generateReport = async (sessionId, sessionType) => {
        setLoading(true);
        try {
            const url = sessionType === 'writing' ? `/api/writingAnalysis/report/${sessionId}` : `/api/readingAnalysis/report/${sessionId}`;
            const response = await axios.get(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setReportData(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return { generateReport, reportData, loading, error };
};

export default useGenerateReport;
