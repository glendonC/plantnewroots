import { useState, useEffect } from 'react';
import axios from 'axios';

const useReadingSessions = (token) => {
    const [readingSessions, setReadingSessions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReadingSessions = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/api/readingSessions', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setReadingSessions(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchReadingSessions();
    }, [token]);

    return { readingSessions, loading, error };
};

export default useReadingSessions;
