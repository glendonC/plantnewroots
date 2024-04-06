import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './analysisreport.css';

function AnalysisReport() {
  const [generalReport, setGeneralReport] = useState(null);
  const [detailedAnalysis, setDetailedAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState('');
  const [generatedText, setGeneratedText] = useState('');

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get('/api/writingConversations', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        setConversations(response.data);
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      }
    };

    fetchConversations();
  }, []);

  // get report when a conversation is selected
  useEffect(() => {
    if (selectedConversationId) {
      fetchGeneralReport(selectedConversationId);
      fetchDetailedAnalysis(selectedConversationId);
    }
  }, [selectedConversationId]);

  useEffect(() => {
    if (generalReport && detailedAnalysis) {
      generateAIContent();
    }
  }, [generalReport, detailedAnalysis]);
  

  const handleConversationSelect = (event) => {
    setSelectedConversationId(event.target.value);
  };

  const fetchGeneralReport = async (conversationId) => {
    try {
      const response = await axios.get(`/api/analysis/report/${conversationId}`, {
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

  const fetchDetailedAnalysis = async (conversationId) => {
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

  const createAIPrompt = (generalReport, detailedAnalysis) => {
    let prompt = "Here's an analysis of the user's conversation: ";
  
    if (generalReport) {
      prompt += `The average sentiment score is ${generalReport.sentimentScoreAverage}, `;
      prompt += `with a total of ${generalReport.analysisCount} analyses conducted. `;
    }
  
    if (detailedAnalysis && detailedAnalysis.length > 0) {
      prompt += "The detailed analysis reveals areas for improvement in grammar and style. ";
    }
  
    prompt += "Based on this analysis, provide recommendations for the user to improve their conversation skills.";
  
    return prompt;
  };

  const generateAIContent = async () => {
    if (!generalReport || !detailedAnalysis) {
      console.error("Data for generating AI content is incomplete.");
      return;
    }
  
    const prompt = createAIPrompt(generalReport, detailedAnalysis);
  
    try {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
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

      <select onChange={handleConversationSelect} value={selectedConversationId}>
        <option value="">Select a conversation</option>
        {conversations.map((conversation) => (
          <option key={conversation._id} value={conversation._id}>
            {conversation.name} - {conversation.tag}
          </option>
        ))}
      </select>

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
