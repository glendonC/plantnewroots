import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const Chart = ({ data, type }) => {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Progress Over Time'
            }
        }
    };

    const chartData = {
        labels: data.map(d => d.label),
        datasets: [
            {
                label: 'Score',
                data: data.map(d => d.value),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            }
        ]
    };

    return (
        <div>
            <h2>Performance Chart</h2>
            {type === 'line' && <Line data={chartData} options={options} />}
            {/* Add more chart types as needed */}
        </div>
    );
};

export default Chart;
