import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Tab, Tabs } from 'react-bootstrap';
import ConversationSelector from './ConversationSelector';
import AIGeneratedContentWriting from './AIGeneratedContentWriting';
import { useLoading } from '../../hooks/useLoading';
import {
  fetchGeneralWritingReport,
  fetchDetailedWritingAnalysis,
  fetchUserWritingMessages,
  fetchSavedReport,
} from '../../services/writingAnalysisService';
import AIGeneratedContentReading from './AIGeneratedContentReading';
import {
  fetchReadingSessionDetails,
  saveReadingAnalysis,
  fetchSavedReadingAnalysis
} from '../../services/readingAnalysisService';
import { generateAIContentReading } from '../../services/aiContentServiceReading';
import { generateAIContentWriting } from '../../services/aiContentServiceWriting';
import HomeButton from '../../components/homebutton/HomeButton';
import './analysisreport.css';
import axios from 'axios';

function AnalysisReport() {
  const { loading, startLoading, stopLoading } = useLoading();
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [sessionType, setSessionType] = useState('writing');


  useEffect(() => {
    const fetchConversations = async () => {
      console.log("Selected Session Type: ", sessionType);
      const url = sessionType === 'writing' ? '/api/writingConversations' : '/api/reading-sessions';
      try {
        const response = await axios.get(url, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        let filteredConversations = [];
        const seenIds = new Set();
  
        response.data.forEach(conversation => {
          if (!seenIds.has(conversation.conversationId)) {
            filteredConversations.push(conversation);
            seenIds.add(conversation.conversationId);
          }
        });
        console.log("Fetched Conversations: ", response.data);
        setConversations(filteredConversations);
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      }
    };
  
    fetchConversations();
  }, [sessionType]);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedConversationId) return;
  
      startLoading();
      try {
        let generatedText = '';
        if (sessionType === 'writing') {
          const savedReport = await fetchSavedReport(selectedConversationId);
          if (savedReport) {
            generatedText = savedReport.generatedText;
          } else {
            const generalReportData = await fetchGeneralWritingReport(selectedConversationId);
            const detailedAnalysisData = await fetchDetailedWritingAnalysis(selectedConversationId);
            const userMessages = await fetchUserWritingMessages(selectedConversationId);
            generatedText = await generateAIContentWriting(generalReportData, detailedAnalysisData, userMessages);
          }
        } 
        else if (sessionType === 'reading') {
          try {
            const savedReport = await fetchSavedReadingAnalysis(selectedConversationId);
            if (savedReport) {
              setGeneratedText(savedReport.analysis.generatedText);
            } else {
              throw new Error("No saved analysis found.");
            }
          } catch (error) {
            if (error.response && error.response.status === 404) {
              try {
                const readingDetails = await fetchReadingSessionDetails(selectedConversationId);
                const { text, feedback } = readingDetails;
  
                console.log("Fetched Text:", text);
                console.log("Fetched Feedback:", feedback);
  
                if (text && feedback) {
                  const generatedAnalysis = await generateAIContentReading(text, feedback);
                  console.log("Generated Analysis:", generatedAnalysis);
  
                  const savedAnalysis = await saveReadingAnalysis(selectedConversationId, text, {
                    generatedText: generatedAnalysis,
                    analysisText: extractAnalysisText(generatedAnalysis),
                    feedback: extractFeedback(generatedAnalysis)
                  });
                  setGeneratedText(savedAnalysis.analysis.generatedText);
                } else {
                  console.error("Data for generating AI content for reading is incomplete.");
                }
              } catch (error) {
                console.error("Error generating or saving analysis:", error);
              }
            } else {
              console.error("Error fetching saved reading analysis:", error);
            }
          }
        }
        if (generatedText) {
          setGeneratedText(generatedText);
        }
      } catch (error) {
        console.error(`Error fetching data for ${sessionType} content generation:`, error);
      } finally {
        stopLoading();
      }
    };
  
    fetchData();
  }, [selectedConversationId, sessionType]);

  function extractAnalysisText(generatedAnalysis) {
    const analysisTextPattern = /\*\*Language Comprehension Analysis:\*\*\n([\s\S]*?)\n\*\*Accuracy Analysis:\*\*/;
    const match = generatedAnalysis.match(analysisTextPattern);
    return match ? match[1].trim() : '';
  }
  
  function extractFeedback(generatedAnalysis) {
    const feedbackPattern = /\*\*Exercises to Address Mistakes:\*\*\n([\s\S]*?)\n\*\*Tips for Enhancing Text Comprehension:\*\*/;
    const match = generatedAnalysis.match(feedbackPattern);
    return match ? match[1].trim() : '';
  }

  const handleConversationSelect = (selectedConversationId) => {
    setGeneratedText('');
    setSelectedConversationId(selectedConversationId);
  };
  
  const handleTabSelect = (key) => {
    setSelectedConversationId('');
    setGeneratedText('');
    setSessionType(key);
  };

  return (
    <Container className="mt-4 d-flex flex-column min-vh-100">
      <Row className="justify-content-md-center pt-5">
        <Col xs={12} className="text-center">
          <h1>Conversation Analysis Report</h1>
        </Col>
      </Row>
      <Row className="justify-content-md-center py-3">
        <Col xs={12}>
        <Tabs defaultActiveKey="writing" id="type-tabs" onSelect={handleTabSelect}>
          <Tab eventKey="writing" title="Writing">
              <ConversationSelector
                  conversations={conversations}
                  selectedConversationId={selectedConversationId}
                  onSelect={handleConversationSelect}
              />
          </Tab>
          <Tab eventKey="reading" title="Reading">
              <ConversationSelector
                  conversations={conversations.filter(c => c.type === 'reading')}
                  selectedConversationId={selectedConversationId}
                  onSelect={handleConversationSelect}
              />
          </Tab>
        </Tabs>
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col xs={12} md={8}>
            {selectedConversationId && (sessionType === 'writing' ? (
                <AIGeneratedContentWriting loading={loading} generatedText={generatedText} />
            ) : (
                <AIGeneratedContentReading loading={loading} generatedText={generatedText} />
            ))}
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