import React, { useState } from 'react';
import axios from 'axios';
import './analysisreport.css';

function AnalysisReport() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAnalysisReport = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/analysis/report', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setAnalysisResult(response.data);
    } catch (error) {
      console.error('Failed to fetch analysis report:', error);
      alert('Failed to fetch analysis report. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="analysis-report-container">
      <h1>Conversation Analysis Report</h1>
      <button onClick={fetchAnalysisReport} disabled={loading}>
        {loading ? 'Loading...' : 'Get Analysis Report'}
      </button>
      {analysisResult && (
        <div className="report-result">
          <p>Average Sentiment Score: {analysisResult.sentimentScoreAverage}</p>
          <p>Number of Analyses Conducted: {analysisResult.analysisCount}</p>
        </div>
      )}
    </div>
  );
}

export default AnalysisReport;
