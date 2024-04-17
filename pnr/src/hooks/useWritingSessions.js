import { useState, useEffect } from 'react';
import axios from 'axios';

const useWritingSessions = (token) => {
    const [writingSessions, setWritingSessions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWritingSessions = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/api/writingConversations', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setWritingSessions(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchWritingSessions();
    }, [token]);

    return { writingSessions, loading, error };
};

export default useWritingSessions;
