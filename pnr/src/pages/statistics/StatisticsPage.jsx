import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import StatsCard from './components/StatsCard';
import Chart from './components/Chart';
import Filters from './components/Filters';
import useStatistics from './hooks/useStatistics';
import './styles/Statistics.css';

const StatisticsPage = () => {
    const { data, isLoading, error } = useStatistics();

    if (isLoading) return <div>Loading statistics...</div>;
    if (error) return <div>Error loading statistics: {error.message}</div>;

    return (
        <Container className="statistics-container mt-4 d-flex flex-column min-vh-100">
            <Row className="justify-content-md-center pt-5">
                <Col xs={12}>
                    <h1 className="text-center">Statistics</h1>
                </Col>
            </Row>
            <Row className="justify-content-md-center mt-3">
                <Col md={6}>
                    <Filters />
                </Col>
            </Row>
            <Row className="justify-content-md-center mt-3">
                <Col md={8}>
                    {data.trends && <Chart data={data.trends} type="line" />}
                </Col>
            </Row>
            <Row className="justify-content-md-center mt-3">
                {Object.keys(data).filter(key => key !== 'trends').map(key => (
                    <Col md={3} key={key}>
                        <StatsCard title={key.charAt(0).toUpperCase() + key.slice(1)} value={data[key]} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default StatisticsPage;
