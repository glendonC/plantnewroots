import React, { useState, useEffect } from "react";
import { useLevelLanguage } from "../../contexts/LevelLanguageContext";
import { Modal, Button, Form, Container, Row, Col, Dropdown } from 'react-bootstrap';
import HomeButton from "../../components/homebutton/HomeButton";
import Transition from "../../components/transition/Transition";
import axios from 'axios';

const Listening = () => {
  const { selectedLevel, selectedLanguage } = useLevelLanguage();
  const [textLength, setTextLength] = useState('');
  const [content, setContent] = useState({ text: "", questions: [] });
  const [answers, setAnswers] = useState({});
  const [expectedAnswers, setExpectedAnswers] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [speechReady, setSpeechReady] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [sessionName, setSessionName] = useState("");


  const generateContent = async () => {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
    let textPrompt = "";
    
    switch (textLength) {
      case "short":
        textPrompt = `Generate a detailed, factual 2-3 sentence story suitable for a ${selectedLevel} level student in ${selectedLanguage}.`;
        break;
      case "medium":
        textPrompt = `Generate a detailed, factual 4-8 sentence story suitable for a ${selectedLevel} level student in ${selectedLanguage}.`;
        break;
      case "long":
        textPrompt = `Generate a detailed, factual 9+ sentence story suitable for a ${selectedLevel} level student in ${selectedLanguage}.`;
        break;
      default:
        console.error("Invalid text length selected.");
        return;
    }
    
    try {
      const textResult = await model.generateContent(textPrompt);
      const textResponse = await textResult.response;
      const generatedText = await textResponse.text();
      setContent({ text: generatedText, questions: [] });
      await generateQuestions(generatedText);
      setSpeechReady(true);
    } catch (error) {
      console.error('Error generating content:', error);
      setContent({ text: "Failed to generate content.", questions: [] });
    }
  };

  const handlePlayAudio = async () => {

    const response = await fetch('/api/text-to-speech/synthesize', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: content.text, language: selectedLanguage })
    });

    if (response.ok) {
        const { audioBase64 } = await response.json();
        const audioBlob = new Blob([Uint8Array.from(atob(audioBase64), c => c.charCodeAt(0))], { type: 'audio/mp3' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
    } else {
        alert("Failed to play audio. Please try again.");
    }
  };

  
  const generateQuestions = async (text) => {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    let questionPrompt = `Based on the following text: "${text}", generate three direct questions that can be clearly answered from the text.`;

    try {
      const questionResult = await model.generateContent(questionPrompt);
      const questionResponse = await questionResult.response;
      const questionsText = await questionResponse.text();
      const questions = questionsText.split("\n").filter(q => q).map(query => ({ query }));
      setContent(prev => ({ ...prev, questions }));
    } catch (error) {
      console.error('Error generating questions:', error);
      setContent(prev => ({ ...prev, questions: [] }));
    }
  };
  
  const handleAnswerChange = (index, value) => {
    setAnswers(prev => ({ ...prev, [index]: value }));
  };

  const submitAnswers = async () => {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `The text provided is: "${content.text}". Evaluate the following answers based on the text and questions provided:\n${
      content.questions.map((q, i) => `Question: ${q.query}\nUser Answer: ${answers[i] || 'no answer provided'}`).join("\n")
    }`;
  
    console.log("Sending this prompt to AI:", prompt);

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const evaluation = await response.text();
      setFeedback(evaluation);
      setSubmitted(true);
    } catch (error) {
      console.error('Error evaluating answers:', error);
      setFeedback("Failed to evaluate answers.");
      setSubmitted(false);
    }    
  };
  
  const evaluateAnswers = async () => {
    if (submitted) {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
      const prompt = `The text provided is: "${content.text}". Evaluate the following answers based on the text and questions provided:\n${
          content.questions.map((q, i) => `Question ${i + 1}: ${q.query}\nExpected Answer: ${expectedAnswers[i]}\nUser Answer: ${answers[i] || 'no answer provided'}`).join("\n")
        }`;
  
    
      console.log("Sending this prompt to AI for evaluation:", prompt);
    
      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const evaluation = await response.text();
        setFeedback(evaluation);
      } catch (error) {
        console.error('Error evaluating answers:', error);
        setFeedback("Failed to evaluate answers.");
      }
    }
  };

  useEffect(() => {
    evaluateAnswers();
  }, [content, submitted]);

  const saveSession = async () => {
    const sessionData = {
      name: sessionName,
      content,
      answers,
      feedback
    };
  
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/listening-sessions/save', sessionData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (response.status === 201) {
        console.log("Session saved successfully:", response.data);
        setShowSaveModal(false);
      } else {
        throw new Error('Failed to save session: ' + response.status);
      }
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };
  
  return (
    <Container className="mt-4 d-flex flex-column min-vh-100">
      <div className="flex-grow-1">
        <Row className="justify-content-md-center pt-5">
          <Col xs={12}>
            <h1 className="text-center">Listening Exercise</h1>
            <h4 className="text-center">Language: {selectedLanguage}</h4>
          </Col>
        </Row>
        <Row className="justify-content-md-center mt-3">
          <Col md={6} className="d-flex justify-content-center">
            <Form className="w-100">
              <Form.Group controlId="dropdown-textLengthSelect">
                <Form.Label style={{ fontSize: "1.2rem", color: "white" }}>Select text length:</Form.Label>
                <Dropdown>
                  <Dropdown.Toggle variant="success" id="dropdown-basic-text-length">
                    Select text length: {textLength || "Choose..."}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setTextLength('short')}>Short</Dropdown.Item>
                    <Dropdown.Item onClick={() => setTextLength('medium')}>Medium</Dropdown.Item>
                    <Dropdown.Item onClick={() => setTextLength('long')}>Long</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>
              <div className="d-flex justify-content-between">
                <Button variant="primary" onClick={generateContent} disabled={!textLength} style={{ marginTop: '20px' }}>
                  Generate Text
                </Button>
                {speechReady && (
                  <Button variant="secondary" onClick={handlePlayAudio} style={{ marginTop: '20px', marginLeft: '20px' }}>
                    Play Audio
                  </Button>
                )}
              </div>
            </Form>
          </Col>
        </Row>
        <Row className="justify-content-md-center mt-3">
          <Col md={6}>
            {submitted && (
              <div className="content-section">
                <h4>Text Content:</h4>
                <p>{content.text}</p>
              </div>
            )}
            {content.questions.map((question, index) => (
              <div key={index} className="mb-3" style={{ color: 'white' }}>
                <label>{question.query}</label>
                <input
                  type="text"
                  placeholder="Your answer..."
                  value={answers[index] || ''}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  style={{ color: 'white' }}
                />
              </div>
            ))}
            {content.questions.length > 0 && (
              <Button variant="success" onClick={submitAnswers}>
                Submit Answers
              </Button>
            )}
          </Col>
          <Col md={4} className="align-self-start" style={{ marginTop: '-12px' }}>
            {feedback && (
              <div className="mt-3" style={{ border: '1px solid #ccc', padding: '10px' }}>
                <h3>Feedback</h3>
                {feedback.split('\n').map((feedbackLine, index) => (
                  <p key={index}>{feedbackLine}</p>
                ))}
              </div>
            )}
          </Col>
        </Row>
        <Modal show={showSaveModal} onHide={() => setShowSaveModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Save Listening Session</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="sessionName">
                <Form.Label>Session Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter a name for this session"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowSaveModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={saveSession}>
              Save Session
            </Button>
          </Modal.Footer>
        </Modal>
        <Button variant="primary" onClick={() => setShowSaveModal(true)} className="mt-3">
          Save Session
        </Button>
      </div>
      <HomeButton className="mt-auto"/>
    </Container>
  );
  
  

  
};

export default Transition(Listening);
