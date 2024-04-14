import React, { useState, useRef } from 'react';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import { useLevelLanguage } from "../../contexts/LevelLanguageContext";

const Speaking = () => {
    const { selectedLevel, selectedLanguage } = useLevelLanguage();
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [response, setResponse] = useState('');

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
        console.log("Sending audio to server for transcription");
        const formData = new FormData();
        formData.append('audio', audioBlob);
    
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
            if (data.reply) {
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
    
    const playResponse = async (responseText) => {
        try {
            const response = await fetch('/api/text-to-speech/synthesize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: responseText, language: selectedLanguage }) // Ensure language is appropriately set or managed
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
    
    return  (
        <Container className="mt-4">
            <Row className="justify-content-md-center">
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
        </Container>
    );
};

export default Speaking;
