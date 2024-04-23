import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Tab, Tabs } from 'react-bootstrap';
import ConversationSelector from './ConversationSelector';
import AIGeneratedContentReading from './AIGeneratedContentReading';
import AIGeneratedContentWriting from './AIGeneratedContentWriting';
import AIGeneratedContentListening from './AIGeneratedContentListening';
import AIGeneratedContentSpeaking from './AIGeneratedContentSpeaking';
import { useLoading } from '../../hooks/useLoading';

import {
  fetchReadingSessionDetails,
  saveReadingAnalysis,
  fetchSavedReadingAnalysis
} from '../../services/readingAnalysisService';
import { generateAIContentReading } from '../../services/aiContentServiceReading';

import {
  fetchGeneralWritingReport,
  fetchDetailedWritingAnalysis,
  fetchUserWritingMessages,
  fetchSavedReport,
} from '../../services/writingAnalysisService';
import { generateAIContentWriting } from '../../services/aiContentServiceWriting';

import {
  fetchListeningSessionDetails,
  saveListeningAnalysis,
  fetchSavedListeningAnalysis
} from '../../services/listeningAnalysisService';
import { generateAIContentListening } from '../../services/aiContentServiceListening';

import {
  fetchSpeakingSessionDetails,
  saveSpeakingAnalysis,
  fetchSavedSpeakingAnalysis,
  fetchSpeakingSession // Add this line
} from '../../services/speakingAnalysisService';
import { generateAIContentSpeaking } from '../../services/aiContentServiceSpeaking';


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
      let url = '';
      switch (sessionType) {
        case 'writing':
          url = '/api/writingConversations';
          break;
        case 'reading':
          url = '/api/reading-sessions';
          break;
        case 'listening':
          url = '/api/listening-sessions';
          break;
        case 'speaking':
          url = '/api/speaking-sessions';
          break;
        default:
          console.log('Unknown session type: ', sessionType);
          return;
      }
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
        switch (sessionType) {
          case 'writing':
            try {
              const savedWritingReport = await fetchSavedReport(selectedConversationId);
              generatedText = savedWritingReport.generatedText;
            } catch (error) {
              if (error.response && error.response.status === 404) {
                const generalReportData = await fetchGeneralWritingReport(selectedConversationId);
                const detailedAnalysisData = await fetchDetailedWritingAnalysis(selectedConversationId);
                const userMessages = await fetchUserWritingMessages(selectedConversationId);
                generatedText = await generateAIContentWriting(generalReportData, detailedAnalysisData, userMessages);
              } else {
                throw error;
              }
            }
            break;

          case 'speaking':
            try {
              const savedSpeakingReport = await fetchSavedSpeakingAnalysis(selectedConversationId);
              if (savedSpeakingReport && savedSpeakingReport.generatedText) {
                generatedText = savedSpeakingReport.generatedText;
              } else {
                const speakingSession = await fetchSpeakingSession(selectedConversationId);
                if (!speakingSession || !speakingSession.messages || speakingSession.messages.length < 2) {
                } else {
                  const transcript = speakingSession.messages[0].text || "No transcript available";
                  const responseText = speakingSession.messages[1].text || "No response available"; // Ensure this line is correctly assigning responseText
                  generatedText = await generateAIContentSpeaking(transcript, responseText);
                  await saveSpeakingAnalysis(selectedConversationId, transcript, responseText, generatedText);
                }
              }
            } catch (error) {
              console.error("Error fetching or processing speaking analysis:", error);
            }
            break;
            
          case 'reading':
            try {
              const savedReadingReport = await fetchSavedReadingAnalysis(selectedConversationId);
              generatedText = savedReadingReport.analysis.generatedText;
            } catch (error) {
              if (error.response && error.response.status === 404) {
                const readingDetails = await fetchReadingSessionDetails(selectedConversationId);
                const { text, feedback } = readingDetails;
                if (text && feedback) {
                  generatedText = await generateAIContentReading(text, feedback);
                  await saveReadingAnalysis(selectedConversationId, text, {
                    generatedText,
                    analysisText: extractAnalysisText(generatedText),
                    feedback: extractFeedback(generatedText)
                  });
                } else {
                  console.error("Data for generating AI content for reading is incomplete.");
                }
              } else {
                throw error;
              }
            }
            break;
  
          case 'listening':
            try {
              const savedListeningReport = await fetchSavedListeningAnalysis(selectedConversationId);
              generatedText = savedListeningReport.analysis.generatedText;
            } catch (error) {
              if (error.response && error.response.status === 404) {
                const listeningDetails = await fetchListeningSessionDetails(selectedConversationId);
                const { text, feedback } = listeningDetails;
                if (text && feedback) {
                  generatedText = await generateAIContentListening(text, feedback);
                  await saveListeningAnalysis(selectedConversationId, text, {
                    generatedText,
                    analysisText: extractAnalysisText(generatedText),
                    feedback: extractFeedback(generatedText)
                  });
                } else {
                  console.error("Data for generating AI content for listening is incomplete.");
                }
              } else {
                throw error;
              }
            }
            break;            

          default:
            console.log('Unknown session type:', sessionType);
            break;
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
                  conversations={conversations.filter(c => c.type === 'writing')}
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
          <Tab eventKey="listening" title="Listening">
              <ConversationSelector
                  conversations={conversations.filter(c => c.type === 'listening')}
                  selectedConversationId={selectedConversationId}
                  onSelect={handleConversationSelect}
              />
          </Tab>
          <Tab eventKey="speaking" title="Speaking">
              <ConversationSelector
                  conversations={conversations.filter(c => c.type === 'speaking')}
                  selectedConversationId={selectedConversationId}
                  onSelect={handleConversationSelect}
              />
          </Tab>
        </Tabs>
        </Col>
      </Row>
      <Row className="justify-content-md-center">
      <Col xs={12} md={8}>
        {selectedConversationId && (
            sessionType === 'writing' ? (
                <AIGeneratedContentWriting loading={loading} generatedText={generatedText} />
            ) : sessionType === 'reading' ? (
                <AIGeneratedContentReading loading={loading} generatedText={generatedText} />
            ) : sessionType === 'listening' ? (
                <AIGeneratedContentListening loading={loading} generatedText={generatedText} />
            ) : sessionType === 'speaking' && (
                <AIGeneratedContentSpeaking loading={loading} generatedText={generatedText} />
            )
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