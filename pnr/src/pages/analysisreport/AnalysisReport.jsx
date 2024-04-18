import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './analysisreport.css';
import HomeButton from '../../components/homebutton/HomeButton';
import SessionSelector from '../../components/sessionselector/SessionSelector';
import AnalysisDisplay from '../../components/analysisdisplay/AnalysisDisplay';
import useGenerateReport from '../../hooks/useGenerateReport';
import useWritingSessions from '../../hooks/useWritingSessions';
import useReadingSessions from '../../hooks/useReadingSessions';

function AnalysisReport() {
    const [selectedSessionId, setSelectedSessionId] = useState('');
    const [sessionType, setSessionType] = useState('');
    const { writingSessions, loading: loadingWriting, error: errorWriting } = useWritingSessions();
    const { readingSessions, loading: loadingReading, error: errorReading } = useReadingSessions();
    
    // Unified session selection handler
// Unified session selection handler
// Unified session selection handler
const handleSessionSelect = (eventKey, type) => {
    const fullSessionId = eventKey; // Use the full session ID directly
    console.log(`Handling selection for type ${type}: Full Session ID - ${fullSessionId}`);
    setSelectedSessionId(fullSessionId);
    setSessionType(type);
};


    
    const handleWritingSessionSelect = (eventKey) => {
        console.log(`Selected writing session eventKey: ${eventKey}`);
        handleSessionSelect(eventKey, 'writing');
    };
      
    const handleReadingSessionSelect = (eventKey) => {
        console.log(`Selected reading session eventKey: ${eventKey}`);
        handleSessionSelect(eventKey, 'reading');
    };
    

    // Get authentication token
    const token = localStorage.getItem('token');  // or use context to get the token

    // Use the hook to generate a report
    const { loading, generatedText, error, fetchReportData } = useGenerateReport(selectedSessionId, sessionType, token);

    // Fetch report data when dependencies change
    useEffect(() => {
        if (selectedSessionId && sessionType) {
            console.log(`Fetching report data for session ID: ${selectedSessionId} and type: ${sessionType}`);
            fetchReportData();
        }
    }, [selectedSessionId, sessionType, fetchReportData]);
    

    return (
        <Container className="mt-4 d-flex flex-column min-vh-100">
            <Row className="justify-content-md-center pt-5">
                <Col xs={12} className="text-center">
                    <h1>Conversation Analysis Report</h1>
                </Col>
            </Row>

            <Row className="justify-content-md-center py-3">
                <Col xs={12} md={8} lg={6}>
                    <SessionSelector
                        writingSessions={writingSessions}
                        readingSessions={readingSessions}
                        onSessionSelect={handleSessionSelect}
                        selectedSessionId={selectedSessionId}
                    />
                </Col>
            </Row>

            <Row className="justify-content-md-center">
                <Col xs={12} md={8}>
                    {loading || loadingWriting || loadingReading ? (
                        <p>Loading...</p>
                    ) : error || errorWriting || errorReading ? (
                        <p>Error: {error || errorWriting || errorReading}</p>
                    ) : (
                        <>
                            {generatedText ? (
                                <AnalysisDisplay text={generatedText} />
                            ) : (
                                <p>No recommendations generated yet.</p>
                            )}
                        </>
                    )}
                </Col>
            </Row>

            <Row className="mt-auto">
                <Col>
                    <HomeButton />
                </Col>
            </Row>
        </Container>
    );
}

export default AnalysisReport;
