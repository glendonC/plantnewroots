import axios from 'axios';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';


export const fetchData = async (range) => {
  let startDate, endDate;
  const now = new Date();

  switch(range) {
    case 'today':
      startDate = startOfDay(now);
      endDate = endOfDay(now);
      break;
    case 'week':
      startDate = startOfWeek(now, { weekStartsOn: 1 });
      endDate = endOfWeek(now, { weekStartsOn: 1 });
      break;
    case 'month':
      startDate = startOfMonth(now);
      endDate = endOfMonth(now);
      break;
    case 'all':
      startDate = new Date(0);
      endDate = new Date();
      break;
    default:
      throw new Error('Invalid date range selected');
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