import React, { useState } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';

const Speaking = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [response, setResponse] = useState('');

    let mediaRecorder;
    let audioChunks = [];
    
    const handleSuccess = (stream) => {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();
    
        mediaRecorder.addEventListener("dataavailable", event => {
            audioChunks.push(event.data);
        });
    
        mediaRecorder.addEventListener("stop", () => {
            const audioBlob = new Blob(audioChunks);
            audioChunks = [];
            sendAudioToSpeechToText(audioBlob);
        });
    };
    
    const startRecording = () => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(handleSuccess);
        setIsRecording(true);
    };
    
    const stopRecording = () => {
        mediaRecorder.stop();
        setIsRecording(false);
    };

    const sendAudioToSpeechToText = async (audioBlob) => {
        const formData = new FormData();
        formData.append('audio', audioBlob);
    
        try {
            const response = await fetch('/api/transcribe', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            setTranscript(data.transcription);
        } catch (error) {
            console.error('Error sending audio to backend:', error);
            setTranscript('Failed to transcribe audio.');
        }
    };
    

    const fetchDialogflowResponse = async (text) => {
        // send text to Dialogflow API to get a response
        // and then ppdate the response state with the Dialogflow response
        setResponse('Dialogflow response...');
    };

    const playResponse = (responseText) => {
        // send responseText to tts api
        // play audio using HTML audio element or smthg else
    };
    
    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <h1>Speaking Exercise</h1>
                    <Button onClick={isRecording ? stopRecording : startRecording}>
                        {isRecording ? 'Stop Recording' : 'Start Recording'}
                    </Button>
                    <div className="mt-3">
                        <h5>Your Transcript:</h5>
                        <p>{transcript}</p>
                        <h5>Bot Response:</h5>
                        <p>{response}</p>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Speaking;
