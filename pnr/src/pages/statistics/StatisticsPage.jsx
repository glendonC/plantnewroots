import React, { useState, useEffect } from 'react';
import StackedBarChart from '../../components/charts/StackedBarChart';
import PieChart from '../../components/charts/PieChart';
import WordCloudChart from '../../components/charts/WordCloudChart';
import { fetchData } from '../../services/statsService';

const StatisticsPage = () => {
  const [data, setData] = useState({
    stackedData: { labels: [], datasets: [] },
    pieData: [],
    wordCloudData: []
  });
  
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date()); 
  
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetchData(startDate, endDate);
        console.log("API Response:", response);
        const transformedStackedData = transformToStackedData(response);
        const transformedPieData = transformToPieData(response);
        const transformedWordCloudData = transformToWordCloudData(response);
        
        console.log("Stacked Data:", transformedStackedData);
        console.log("Pie Data:", transformedPieData);
        console.log("Word Cloud Data:", transformedWordCloudData);

        setData({
          stackedData: transformedStackedData,
          pieData: transformedPieData,
          wordCloudData: transformedWordCloudData
        });
      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
      }
    };
  
    getData();
  }, [startDate, endDate]);

  const transformToStackedData = (response) => {
    const labels = ['Listening', 'Reading', 'Speaking', 'Writing'];
    const datasets = [{
      label: 'Counts',
      data: [
        response.listening,
        response.reading,
        response.speaking,
        response.writing
      ],
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)'
      ],
    }];
  
    return { labels, datasets };
  };
  
const transformToPieData = (response) => {
  return [
    { type: 'Listening', value: response.listening },
    { type: 'Reading', value: response.reading },
    { type: 'Speaking', value: response.speaking },
    { type: 'Writing', value: response.writing }
  ];
};

const transformToWordCloudData = (response) => {
  return [
    { text: 'Listening', size: response.listening * 10 },
    { text: 'Reading', size: response.reading * 10 },
    { text: 'Speaking', size: response.speaking * 10 },
    { text: 'Writing', size: response.writing * 10 }
  ];
};

  if (error) {
    return <div>Error loading statistics: {error}</div>;
  }

  return (
    <div>
      <h1>Statistics</h1>
      <div>
        <h2>Stacked Bar Chart</h2>
        {data.stackedData && data.stackedData.datasets && data.stackedData.datasets.length > 0 && <StackedBarChart data={data.stackedData} />}
      </div>
      <div>
        <h2>Pie Chart</h2>
        {data.pieData && data.pieData.length > 0 && <PieChart data={data.pieData} />}
      </div>
      <div>
        <h2>Word Cloud</h2>
        {data.wordCloudData && data.wordCloudData.length > 0 && <WordCloudChart words={data.wordCloudData} />}
      </div>
    </div>
  );

  
};

export default StatisticsPage;
