import axios from 'axios';

export const fetchData = async (selectedRange) => {
  const url = `/api/stats/statistics?timeframe=${selectedRange}`;
  try {
      const response = await axios.get(url);
      return response.data;
  } catch (error) {
      console.error('Error fetching statistics data:', error);
      throw error;
  }
};