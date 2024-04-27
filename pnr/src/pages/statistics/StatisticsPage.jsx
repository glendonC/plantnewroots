import React, { useState, useEffect } from 'react';
import StackedBarChart from '../../components/charts/StackedBarChart';
import PieChart from '../../components/charts/PieChart';
import WordCloudChart from '../../components/charts/WordCloudChart';
import { fetchData } from '../../services/statsService';
import { Container, Row, Col, ButtonGroup, Button } from 'react-bootstrap';

const StatisticsPage = () => {
  const [data, setData] = useState({
    stackedData: { labels: [], datasets: [] },
    pieData: [],
    wordCloudData: []
  });
  
  const [error, setError] = useState(null);
  const [selectedRange, setSelectedRange] = useState('all');
  const [selectedChart, setSelectedChart] = useState('stackedBar');

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetchData(selectedRange);
        const transformedStackedData = transformToStackedData(response);
        const transformedPieData = transformToPieData(response);
        const transformedWordCloudData = transformToWordCloudData(response);

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
  }, [selectedRange]);

  const handleRangeSelect = (range) => {
    setSelectedRange(range);
  };

  const transformToStackedData = (response) => {
    return {
      labels: ['Listening', 'Reading', 'Speaking', 'Writing'],
      datasets: [{
        label: 'Counts',
        data: [response.listening, response.reading, response.speaking, response.writing],
        backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)', 'rgba(75, 192, 192, 0.5)', 'rgba(153, 102, 255, 0.5)']
      }]
    };
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
    <Container className="mt-4 d-flex flex-column min-vh-100">
      <Row className="justify-content-md-center pt-5">
        <Col xs={12}>
          <h1 className="text-center">Statistics</h1>
        </Col>
      </Row>
      <Row className="justify-content-md-center pt-3">
        <Col xs={12}>
        <ButtonGroup>
          <Button
            variant={selectedRange === 'today' ? 'primary' : 'secondary'}
            onClick={() => handleRangeSelect('today')}
            active={selectedRange === 'today'}
          >
            Today
          </Button>
          <Button
            variant={selectedRange === 'week' ? 'primary' : 'secondary'}
            onClick={() => handleRangeSelect('week')}
            active={selectedRange === 'week'}
          >
            This Week
          </Button>
          <Button
            variant={selectedRange === 'month' ? 'primary' : 'secondary'}
            onClick={() => handleRangeSelect('month')}
            active={selectedRange === 'month'}
          >
            This Month
          </Button>
          <Button
            variant={selectedRange === 'all' ? 'primary' : 'secondary'}
            onClick={() => handleRangeSelect('all')}
            active={selectedRange === 'all'}
          >
            All Time
          </Button>
        </ButtonGroup>
        </Col>
      </Row>
      <Row className="justify-content-md-center pt-3">
        <Col xs={12}>
          <ButtonGroup>
            <Button
              variant={selectedChart === 'stackedBar' ? 'primary' : 'secondary'}
              onClick={() => setSelectedChart('stackedBar')}
              active={selectedChart === 'stackedBar'}
            >
              Stacked Bar Chart
            </Button>
            <Button
              variant={selectedChart === 'pie' ? 'primary' : 'secondary'}
              onClick={() => setSelectedChart('pie')}
              active={selectedChart === 'pie'}
            >
              Pie Chart
            </Button>
            <Button
              variant={selectedChart === 'wordCloud' ? 'primary' : 'secondary'}
              onClick={() => setSelectedChart('wordCloud')}
              active={selectedChart === 'wordCloud'}
            >
              Word Cloud
            </Button>
          </ButtonGroup>
        </Col>
      </Row>
      <Row className="justify-content-md-center pt-3">
        <Col xs={12}>
          {selectedChart === 'stackedBar' && data.stackedData.datasets.length > 0 && <StackedBarChart data={data.stackedData} />}
          {selectedChart === 'pie' && data.pieData.length > 0 && <PieChart data={data.pieData} />}
          {selectedChart === 'wordCloud' && data.wordCloudData.length > 0 && <WordCloudChart words={data.wordCloudData} />}
        </Col>
      </Row>
    </Container>
  );
  

  
};

export default StatisticsPage;
