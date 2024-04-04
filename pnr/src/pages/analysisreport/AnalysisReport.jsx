import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './analysisreport.css';

function AnalysisReport() {
  const [generalReport, setGeneralReport] = useState(null);
  const [detailedAnalysis, setDetailedAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  //currently hardcoded
  const conversationId = '660d16d9be47f7f9540c7520';

  const fetchGeneralReport = async () => {
    try {
      const response = await axios.get('/api/analysis/report', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log("General Report Data:", response.data);
      setGeneralReport(response.data);
    } catch (error) {
      console.error('Failed to fetch general report:', error);
    }
};

const fetchDetailedAnalysis = async () => {
  try {
    const response = await axios.post('/api/analysis/analyze', { conversationId }, {
      headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
  });
  
      console.log("Detailed Analysis Data:", response.data);
      setDetailedAnalysis(response.data.detailedAnalysis);
  } catch (error) {
      console.error('Failed to fetch detailed analysis:', error);
  }
};

useEffect(() => {
  setLoading(true);
  Promise.all([fetchGeneralReport(), fetchDetailedAnalysis()]).finally(() => setLoading(false));
}, []);

  return (
    <div className="analysis-report-container">
      <h1>Conversation Analysis Report</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {generalReport && (
            <div className="report-result">
              <p>Average Sentiment Score: {generalReport.sentimentScoreAverage || 'N/A'}</p>
              <p>Number of Analyses Conducted: {generalReport.analysisCount || 0}</p>
            </div>
          )}
<h2>Detailed Analysis</h2>
{detailedAnalysis && detailedAnalysis.length > 0 ? (
    detailedAnalysis.map((analysis, index) => (
        <div key={index} className="analysis-item">
            <h3>Message Analysis {index + 1}</h3>

        </div>
    ))
) : (
    <p>No detailed analysis data available.</p>
)}


        </>
      )}
    </div>
  );
}

export default AnalysisReport;
