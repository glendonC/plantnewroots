import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import './analysisreport.css';
import MagneticButton from '../../components/magneticbutton/MagneticButton';


function AnalysisReport() {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState('');
  const [generatedText, setGeneratedText] = useState('');

  const StyledSelect = styled.select`
  width: 100%;
  padding: 10px 15px;
  border-radius: 5px;
  border: 2px solid #007bff;
  background-color: white;
  font-size: 16px;
  color: #333;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s ease-in-out;

  &:hover, &:focus {
    border-color: #0056b3;
    outline: none;
  }
`;

const StyledDropdownButton = styled(DropdownButton)`
  width: 100%;
  padding: 10px 15px;
  border-radius: 5px;
  border: 2px solid #007bff;
  background-color: white;
  font-size: 16px;
  color: #333;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s ease-in-out;

  &:hover, &:focus {
    border-color: #0056b3;
    outline: none;
  }
`;

const StyledDropdownItem = styled(Dropdown.Item)`
  &:hover, &:focus {
    background-color: #f0f0f0;
  }
`;


  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get('/api/writingConversations', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        let filteredConversations = [];
        const seenIds = new Set();
    
        response.data.forEach(conversation => {
          if (!seenIds.has(conversation.conversationId)) {
            filteredConversations.push(conversation);
            seenIds.add(conversation.conversationId);
          }
          // maybe need to handle user-message-only conversations or handle duplicates differently
        });
    
        setConversations(filteredConversations);
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      }
    };
    

    fetchConversations();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedConversationId) return;
  
      setLoading(true);
      try {
        let generalReportData, detailedAnalysisData, generatedText;
        const savedReport = await fetchSavedReport(selectedConversationId);
        if (savedReport) {
          generatedText = savedReport.generatedText;
          setGeneratedText(generatedText);
        } else if (!generatedText) {
          generalReportData = await fetchGeneralReport(selectedConversationId);
          detailedAnalysisData = await fetchDetailedAnalysis(selectedConversationId);
          const userMessages = await fetchUserMessages(selectedConversationId);
          if (!generalReportData || !detailedAnalysisData || !userMessages || userMessages.length === 0) {
            throw new Error('Data for generating AI content is incomplete.');
          }
          generatedText = await generateAIContent(generalReportData, detailedAnalysisData, userMessages);
        }
      } catch (error) {
          console.error('Error fetching data for AI content generation:', error);
      } finally {
          setLoading(false);
      }
  };
  
    
  
    fetchData();
  }, [selectedConversationId]);
  
  

  const handleConversationSelect = (selectedConversationId) => {
    setSelectedConversationId(selectedConversationId);
  };
  
  const fetchGeneralReport = async (conversationId) => {
    try {
      const response = await axios.get(`/api/analysis/report/${conversationId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log("General Report Data:", response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch general report:', error);
    }
  };

  const fetchSavedReport = async (conversationId) => {
    try {
        const response = await axios.get(`/api/analysis/${conversationId}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        console.log("Saved Report Data:", response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch saved report:', error);
        return null;
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
      return response.data.detailedAnalysis;
    } catch (error) {
        console.error('Failed to fetch detailed analysis:', error);
    }
  };
  

  const fetchUserMessages = async (conversationId) => {
    try {
      const response = await axios.get(`/api/writingConversations/userMessages/${conversationId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      console.log("User Messages:", response.data);
  
      // Check if the response data is null or undefined
      if (!response.data || !response.data.messages) {
        throw new Error('No messages found in the response data');
      }
  
      return response.data.messages;
    } catch (error) {
      console.error('Failed to fetch user messages:', error);
      return [];
    }
  };
  

  const createAIPrompt = (generalReport, detailedAnalysis, userMessages) => {
    let prompt = `Analyze the following conversation data and provide specific feedback and recommendations for improvement:\n\n`;
  
    prompt += `General Analysis:\n- Average Sentiment Score: ${generalReport.sentimentScoreAverage} (${generalReport.sentimentScoreAverage < 0 ? "negative" : "positive or neutral"} tone)\n`;
    prompt += `- Number of Analyses Conducted: ${generalReport.analysisCount}\n\n`;
  
    prompt += `Detailed Analysis Findings:\n`;
    detailedAnalysis.forEach((issue, index) => {
      prompt += `${index + 1}. ${issue.aspect}: ${issue.feedback}\n`;
    });
  
    prompt += `\nExamples from the conversation:\n`;
    userMessages.forEach((msg, index) => {
      prompt += `${index + 1}. "${msg.text}"\n`;
    });
  
    prompt += `\nBased on the above analysis and examples, provide specific feedback and actionable recommendations for the user to improve their conversation skills. Focus on aspects such as grammar, style, vocabulary, and engagement.`;
  
    return prompt;
  };
  
  

  const generateAIContent = async (generalReportData, detailedAnalysisData, userMessages) => {
    if (!selectedConversationId) {
      console.error("No conversation selected.");
      return;
    }
    if (!generalReportData || !detailedAnalysisData || userMessages.length === 0) {
      console.error("Data for generating AI content is incomplete.");
      setLoading(false);
      return;
    }
  
    setLoading(true);
    const prompt = createAIPrompt(generalReportData, detailedAnalysisData, userMessages);
  
    try {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();
      setGeneratedText(text);
      await saveGeneratedText(selectedConversationId, text);
    } catch (error) {
      console.error('Error loading GoogleGenerativeAI or generating content:', error);
    } finally {
      setLoading(false);
    }
  };
  
  

  const saveGeneratedText = async (conversationId, generatedText) => {
    try {
        await axios.post('/api/analysis/saveGeneratedText', {
            conversationId,
            generatedText
        }, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        console.log('Generated text saved successfully');
    } catch (error) {
        console.error('Error saving generated text:', error);
    }
};


const formatAIGeneratedText = (generatedText) => {
  const sections = generatedText.split("**").filter(text => text.trim() !== "");
  
  return (
    <>
      {sections.map((section, index) => {
        if (section.startsWith("General Analysis:") || section.startsWith("Detailed Analysis Findings:")) {
          return <h3 key={index}>{section}</h3>;
        } else if (section.startsWith("Examples from the conversation:")) {
          const messages = section.split("\n").filter(text => text.trim() !== "" && !text.startsWith("Examples from"));
          return (
            <div key={index}>
              <h4>Examples from the conversation:</h4>
              <ul>
                {messages.map((msg, msgIndex) => (
                  <li key={msgIndex}>{msg}</li>
                ))}
              </ul>
            </div>
          );
        } else if (section.startsWith("Personalized Recommendations:") || section.startsWith("Overall Improvement Tips:")) {
          const items = section.split("*").filter(text => text.trim() !== "");
          return (
            <div key={index}>
              <h4>{items.shift()}</h4>
              <ul>
                {items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            </div>
          );
        } else {
          return <p key={index} style={{ color: 'white' }}>{section}</p>;
        }
      })}
    </>
  );
};


return (
  <div className="page-container d-flex flex-column mh-100">
    <div className="analysis-report-container flex-grow-1">
      <h1>Conversation Analysis Report</h1>
      <Dropdown onSelect={handleConversationSelect}>
      <Dropdown.Toggle variant="primary" id="conversation-dropdown">
        {selectedConversationId ? conversations.find(conversation => conversation._id === selectedConversationId)?.name : 'Select a conversation'}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {conversations.map(conversation => (
          <Dropdown.Item key={conversation._id} eventKey={conversation._id}>
            {conversation.name} - {conversation.tag}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {generatedText ? (
            <div>
              <h2>Generated Recommendations</h2>
              {formatAIGeneratedText(generatedText)}
            </div>
          ) : (
            <p>No recommendations generated yet.</p>
          )}
        </>
      )}
    </div>
    <MagneticButton className="mt-auto"/>
  </div>
);

}

export default AnalysisReport;
