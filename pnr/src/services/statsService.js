import axios from 'axios';

export const fetchData = async (startDate, endDate) => {
    if (!startDate || !endDate) {
      throw new Error('Start date and end date must be provided');
    }
    try {
      const response = await axios.get('/api/stats/statistics', {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching statistics data:', error);
      throw error;
    }
  };
