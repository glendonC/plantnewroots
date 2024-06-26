import React from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const PieChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.type),
    datasets: [{
      data: data.map(item => item.value),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
    }]
  };

  return (
    <div style={{ width: '800px', height: '700px' }}>
      <Pie 
        data={chartData}
        options={{
          maintainAspectRatio: false
        }}
      />
    </div>
  );
}

export default PieChart;