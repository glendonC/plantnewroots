import React, { useState, useRef } from 'react';
import { Button, Container, Row, Col, Card, Modal, Form } from 'react-bootstrap';
import { useLevelLanguage } from "../../contexts/LevelLanguageContext";
import HomeButton from "../../components/homebutton/HomeButton";


const Speaking = () => {
    const { selectedLevel, selectedLanguage } = useLevelLanguage();
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [response, setResponse] = useState('');
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [sessionName, setSessionName] = useState('');



    const mediaRecorderRef = useRef(null);
    
    const audioChunksRef = useRef([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            audioChunksRef.current = [];

            recorder.ondataavailable = event => {
                audioChunksRef.current.push(event.data);
            };

            recorder.onstop = () => {
                console.log("Recording stopped, processing audio");
                const audioBlob = new Blob(audioChunksRef.current);
                audioChunksRef.current = [];
                sendAudioToSpeechToText(audioBlob);
            };

            recorder.start();
            mediaRecorderRef.current = recorder;
            setIsRecording(true);
            console.log("Recording started");
        } catch (error) {
            console.error('Error accessing media devices:', error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            console.log("Stopping recording...");
        } else {
            console.error('No mediaRecorder instance found');
        }
    };

    const sendAudioToSpeechToText = async (audioBlob) => {
        const languageCodes = {
            English: 'en-US',
            Korean: 'ko-KR',
            //later add m0re here i.e. chinese
        };
        
        const selectedLanguageCode = languageCodes[selectedLanguage];
        console.log("Sending audio to server for transcription in", selectedLanguage);
        const formData = new FormData();
        formData.append('audio', audioBlob);
        formData.append('language', selectedLanguageCode);
    
        try {
            const response = await fetch('/api/speech-to-text/transcribe', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            console.log("Transcription received:", data);
            if (data.transcription) {
                setTranscript(data.transcription);
                fetchDialogflowResponse(data.transcription);
            } else {
                setTranscript("No transcription received.");
            }
        } catch (error) {
            console.error('Error sending audio to backend:', error);
            setTranscript('Failed to transcribe audio.');
        }
    };
    
    
    const fetchDialogflowResponse = async (text) => {
        console.log("Sending text to Dialogflow:", text);
        try {
            const response = await fetch('/api/dialog/daily', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: text })
            });
            const data = await response.json();
            console.log("Dialogflow response received:", data);
            if (data.reply === "AI_TAKEOVER") {
                // Trigger Google AI when Dialogflow returns AI_TAKEOVER
                generateAIResponse(text);
            } else if (data.reply) {
                setResponse(data.reply);
                playResponse(data.reply);
            } else {
                setResponse("No response from Dialogflow.");
            }
        } catch (error) {
            console.error('Failed to fetch response from Dialogflow:', error);
            setResponse('Failed to get response from Dialogflow.');
        }
    };
    
    const generateAIResponse = async (userInput) => {
        try {
            const { GoogleGenerativeAI } = await import('@google/generative-ai');
            const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const prompt = `Provide a concise, playful response to the user's input: "${userInput}"`;
            const textResult = await model.generateContent(prompt);
            const textResponse = await textResult.response;
            const generatedText = await textResponse.text();
            setResponse(generatedText);
            playResponse(generatedText);
        } catch (genError) {
            console.error('Error generating content with Google AI:', genError);
            setResponse("Sorry, I am unable to respond right now.");
        }
    };
    
    
    const playResponse = async (responseText) => {
        try {
            const response = await fetch('/api/text-to-speech/synthesize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: responseText, language: selectedLanguage })
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
        } catch (error) {
            console.error('Error sending text to Text-to-Speech API:', error);
            alert("Failed to process Text-to-Speech request.");
        }
    };
    
    const saveSession = async () => {
        const sessionData = {
          name: sessionName,
          language: selectedLanguage,
          level: selectedLevel,
          messages: [
            { text: transcript },
            { text: response }
          ]
        };
      
        try {
          const token = localStorage.getItem('token');
          const response = await fetch('/api/speaking-sessions/save', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(sessionData)
          });
          const result = await response.json();
          if (response.ok) {
            console.log("Session saved successfully:", result);
            setShowSaveModal(false);
          } else {
            throw new Error('Failed to save session');
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
                        <h1 className="text-center">Speaking Exercise</h1>
                        <h4 className="text-center">Language: {selectedLanguage}</h4>
                    </Col>
                </Row>
                <Row className="justify-content-md-center">
                    <Col md={8} className="text-center">
                        <Button
                            variant={isRecording ? "danger" : "primary"}
                            onClick={isRecording ? stopRecording : startRecording}
                            className="mb-3"
                        >
                            {isRecording ? 'Stop Message' : 'Start Message'}
                        </Button>
                    </Col>
                </Row>
                <Row className="justify-content-md-center">
                    <Col md={8}>
                        <Card>
                            <Card.Body>
                                <Card.Title>Your Transcript:</Card.Title>
                                <Card.Text style={{ color: 'black' }}>
                                    {transcript || "Your recorded text will appear here..."}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row className="justify-content-md-center mt-3">
                    <Col md={8}>
                        <Card>
                            <Card.Body>
                                <Card.Title>Bot Response:</Card.Title>
                                <Card.Text style={{ color: 'black' }}>
                                    {response || "Dialogflow's response will appear here..."}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row className="justify-content-center mt-3">
                    <Col xs={12} md={8} className="text-center">
                        <Button
                        variant="primary"
                        onClick={() => setShowSaveModal(true)}
                        style={{ width: '800px' }}
                        >
                        Save Session
                        </Button>
                    </Col>
                </Row>
            <Modal show={showSaveModal} onHide={() => setShowSaveModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Save Speaking Session</Modal.Title>
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
                    <Button variant="secondary" onClick={() => setShowSaveModal(false)} style={{ color: 'black' }}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={saveSession} style={{ color: 'black' }}>
                        Save Session
                    </Button>
                </Modal.Footer>
            </Modal>
            </div>
            <HomeButton className="mt-auto"/>
        </Container>
    );
    
};

export default Speaking;