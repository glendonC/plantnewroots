import { useState, useEffect } from 'react';
import axios from 'axios';

const useStatistics = () => {
    const [data, setData] = useState({
        grammarAccuracy: 0,
        vocabularyLevel: 0,
        comprehensionScore: 0,
        engagementLevel: 0,
        trends: []
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Update the URL with your actual API endpoint
                const response = await axios.get('/api/statistics');
                setData(response.data);
            } catch (err) {
                setError(err);
            }
            setIsLoading(false);
        };

        fetchData();
    }, []);

    return { data, isLoading, error };
};

export default useStatistics;
