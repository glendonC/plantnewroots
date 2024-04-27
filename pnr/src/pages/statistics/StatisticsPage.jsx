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
            <Button variant="secondary" onClick={() => handleRangeSelect('today')}>Today</Button>
            <Button variant="secondary" onClick={() => handleRangeSelect('week')}>This Week</Button>
            <Button variant="secondary" onClick={() => handleRangeSelect('month')}>This Month</Button>
            <Button variant="secondary" onClick={() => handleRangeSelect('all')}>All Time</Button>
          </ButtonGroup>
        </Col>
      </Row>
      <Row className="justify-content-md-center pt-3">
        <Col xs={12}>
          {data.stackedData.datasets.length > 0 && <StackedBarChart data={data.stackedData} />}
        </Col>
      </Row>
      <Row className="justify-content-md-center pt-3">
        <Col xs={12}>
          {data.pieData.length > 0 && <PieChart data={data.pieData} />}
        </Col>
      </Row>
      <Row className="justify-content-md-center pt-3">
        <Col xs={12}>
          {data.wordCloudData && data.wordCloudData.length > 0 && <WordCloudChart words={data.wordCloudData} />}
        </Col>
      </Row>
    </Container>
  );
  

  
};

export default StatisticsPage;
