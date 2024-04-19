import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ConversationSelector from './ConversationSelector';
import AIGeneratedContentWriting from './AIGeneratedContentWriting';
import { useLoading } from '../../hooks/useLoading';
import {
  fetchGeneralWritingReport,
  fetchDetailedWritingAnalysis,
  fetchUserWritingMessages,
  fetchSavedReport,
  saveGeneratedText
} from '../../services/writingAnalysisService';
import { generateAIContent } from '../../services/aiContentService';
import HomeButton from '../../components/homebutton/HomeButton';
import './analysisreport.css';
import axios from 'axios'
function AnalysisReport() {
  const { loading, startLoading, stopLoading } = useLoading();
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState('');
  const [generatedText, setGeneratedText] = useState('');

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
  
      startLoading();
      try {
        let generatedText;
        const savedReport = await fetchSavedReport(selectedConversationId);
        if (savedReport) {
          generatedText = savedReport.generatedText;
          setGeneratedText(generatedText);
        } else if (!generatedText) {
          const generalWritingReportData = await fetchGeneralWritingReport(selectedConversationId);
          const detailedWritingAnalysisData = await fetchDetailedWritingAnalysis(selectedConversationId);
          const userMessages = await fetchUserWritingMessages(selectedConversationId);
          generatedText = await generateAIContent(generalWritingReportData, detailedWritingAnalysisData, userMessages);
          setGeneratedText(generatedText);
          await saveGeneratedText(selectedConversationId, generatedText);
        }
      } catch (error) {
        console.error('Error fetching data for AI content generation:', error);
      } finally {
        stopLoading();
      }
    };
  
    fetchData();
  }, [selectedConversationId]);

  const handleConversationSelect = (selectedConversationId) => {
    setSelectedConversationId(selectedConversationId);
  };

  return (
    <Container className="mt-4 d-flex flex-column min-vh-100">
      <Row className="justify-content-md-center pt-5">
        <Col xs={12} className="text-center">
          <h1>Conversation Analysis Report</h1>
        </Col>
      </Row>
      <Row className="justify-content-md-center py-3">
        <Col xs={12} md={8} lg={6}>
          <ConversationSelector
            conversations={conversations}
            selectedConversationId={selectedConversationId}
            onSelect={handleConversationSelect}
          />
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col xs={12} md={8}>
          <AIGeneratedContentWriting loading={loading} generatedText={generatedText} />
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