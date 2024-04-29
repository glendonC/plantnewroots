import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StackedBarChart = ({ data }) => {
  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Analysis Count by Type'
      }
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true
      }
    },
    responsive: true,
    maintainAspectRatio: false
  };

  return (
    <div style={{ height: '800px', width: '700px' }}>
      <Bar data={data} options={options} />
    </div>
  );
}


export default StackedBarChart;
