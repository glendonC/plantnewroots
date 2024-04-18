import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Form, InputGroup, Modal } from 'react-bootstrap';
import { Save } from '@mui/icons-material';
import './professionalwritingconversation.css';

function ProfessionalWritingConversation() {
    const [userInput, setUserInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [conversationName, setConversationName] = useState('');
    const [showModal, setShowModal] = useState(false);

    const conversationTag = "Professional Writing";

    const sendMessage = async () => {
        if (!userInput.trim()) return;
        const newMessage = { text: userInput, from: 'user' };
        setMessages(messages => [...messages, newMessage]);

        try {
            const response = await axios.post('/api/dialog/daily', { message: userInput });
            const replyMessage = { text: response.data.reply, from: 'bot' };
            setMessages(messages => [...messages, replyMessage]);
        } catch (error) {
            console.error('Failed to send message: ', error);
        }

        setUserInput('');
    };

    const handleSaveClick = () => {
        if (!conversationName) {
            setShowModal(true);
            return;
        }
        saveConversation();
    };

    const saveConversation = async () => {
        if (!conversationName) {
            alert('Please enter a name for the conversation.');
            return;
        }
        const payload = {
            participants: [localStorage.getItem('userId'), '660a88e076ab4670bfd0bfc6'],
            messages: messages.map(message => ({
                ...message,
                from: message.from === 'user' ? localStorage.getItem('userId') : '660a88e076ab4670bfd0bfc6',
            })),
            name: conversationName,
            tag: "Professional Writing",
        };
    
        try {
            const response = await axios.post('/api/writingConversations/save', payload, {
                headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}`}
            });
            await saveUserMessages(response.data.sessionId);
            alert('Conversation saved!');
        } catch (error) {
            console.error('Error saving conversation:', error);
            alert('Failed to save the conversation.');
        }
    };
    

    
    const saveUserMessages = async (sessionId) => {
        const userMessages = messages.filter(message => message.from === 'user').map(message => message.text);
    
        try {
            await axios.post('/api/writingConversations/userMessages/save', {
                userId: localStorage.getItem('userId'),
                sessionId,
                messages: userMessages,
                name: conversationName,
                tag: conversationTag,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log('User messages saved successfully!');
        } catch (error) {
            console.error('Error saving user messages:', error);
        }
    };
    
    
    const handleInputChange = (e) => {
        setUserInput(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            sendMessage();
        }
    };

    return (
        <div className="conversation-container">
            <Container fluid className="mt-4">
                <Row className="justify-content-md-center pt-5">
                    <Col xs={12}>
                        <h1 className="text-center">Professional Writing Conversation</h1>
                    </Col>
                </Row>
                <Row className="justify-content-md-center flex-grow-1">
                    <Col xs={12} md={8}>
                        <div className="message-area">
                            {messages.map((message, index) => (
                                <div key={index} className={`message-bubble ${message.from === 'user' ? 'message-user' : 'message-bot'}`}>
                                    {message.text}
                                </div>
                            ))}
                        </div>
                    </Col>
                </Row>
            </Container>

            <Container fluid className="mt-4 raised-input-bar">
    <Row className="justify-content-md-center">
        <Col xs={12} md={8}>
            <Form>
                <InputGroup className="mb-3">
                    <Form.Control
                        type="text"
                        placeholder="Type your message here..."
                        value={userInput}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                    />
                    <Button variant="outline-secondary" onClick={sendMessage}>
                        Send
                    </Button>
                    <Button variant="outline-secondary" onClick={handleSaveClick}>
                        <Save />
                    </Button>
                </InputGroup>
            </Form>
        </Col>
    </Row>
</Container>


            <Modal show={showModal} onHide={() => setShowModal(false)} dialogClassName="modal-content">
                <Modal.Header closeButton>
                    <Modal.Title>Enter Conversation Name</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Control
                        type="text"
                        placeholder="Conversation name"
                        value={conversationName}
                        onChange={(e) => setConversationName(e.target.value)}
                        style={{ background: '#333', color: '#fff' }}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="outline-primary" onClick={() => { if (conversationName) saveConversation(); setShowModal(false); }}>
                        Save Conversation
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ProfessionalWritingConversation;
