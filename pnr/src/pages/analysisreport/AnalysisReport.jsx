import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './analysisreport.css';

function AnalysisReport() {
  const [generalReport, setGeneralReport] = useState(null);
  const [detailedAnalysis, setDetailedAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
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
  Promise.all([fetchGeneralReport(), fetchDetailedAnalysis()])
    .then(generateAIContent)
    .finally(() => setLoading(false));
}, []);


const generateAIContent = async () => {
  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = "Provide a summary and recommendations based on the analysis.";
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    setGeneratedText(text);
  } catch (error) {
    console.error('Error loading GoogleGenerativeAI or generating content:', error);
  }
};

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
      <h2>Generated Recommendations</h2>
      {generatedText ? <p>{generatedText}</p> : <p>Loading recommendations...</p>}
        </>
      )}
    </div>
  );
}

export default AnalysisReport;
