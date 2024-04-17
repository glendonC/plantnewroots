import { useState, useEffect } from 'react';
import axios from 'axios';

const useReadingSessions = () => {
    const [readingSessions, setReadingSessions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const fetchReadingSessions = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get('/api/readingSessions', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setReadingSessions(response.data);
            } catch (err) {
                console.error('Failed to fetch reading sessions:', err);
                setError(err.toString());
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchReadingSessions();
        } else {
            console.log('No token provided');
            setError('Authentication token not provided.');
        }
    }, []);

    return { readingSessions, loading, error };
};

export default useReadingSessions;
