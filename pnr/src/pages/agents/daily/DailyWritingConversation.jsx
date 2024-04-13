import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Card, Form, InputGroup } from 'react-bootstrap';
import './dailywritingconversation.css';
import SaveConversationButton from '../../../components/saveconversationbutton/SaveConversationButton';

function DailyWritingConversation() {
    const [userInput, setUserInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [conversationName, setConversationName] = useState('');

    const conversationTag = "Daily Writing";

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

    const saveConversation = async () => {
        const userId = localStorage.getItem('userId');
        const botId = '660a88e076ab4670bfd0bfc6';
    
        const payload = {
            participants: [userId, botId],
            messages: messages.map(message => ({
                ...message,
                from: message.from === 'user' ? userId : botId,
            })),
            name: conversationName,
            tag: conversationTag,
        };
    
        try {
            const response = await axios.post('/api/writingConversations/save', payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
    
            const { conversationId } = response.data;
            await saveUserMessages(conversationId);
            
            alert('Conversation saved!');
        } catch (error) {
            console.error('Error saving conversation:', error);
            alert('Failed to save the conversation.');
        }
    };
    
    const saveUserMessages = async (conversationId) => {
        const userId = localStorage.getItem('userId');
        const userMessages = messages.filter(message => message.from === 'user').map(message => message.text);
    
        // console.log("Saving user messages with payload:", {
        //     userId,
        //     conversationId,
        //     messages: userMessages,
        //     name: conversationName,
        //     tag: conversationTag,
        // });

        try {
            await axios.post('/api/writingConversations/userMessages/save', {
                userId,
                conversationId,
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
            sendMessage();
        }
    };

    return (
        <Container fluid className="mt-4">
            <Row className="justify-content-md-center">
                <Col xs={12}>
                    <h1 className="text-center">Daily Writing Conversation</h1>
                </Col>
            </Row>
            <Row className="justify-content-md-center">
                <Col xs={12} md={8}>
                    <div className="message-area">
                        {messages.map((message, index) => (
                            <div key={index} className={`message-bubble ${message.from === 'user' ? 'message-user' : 'message-bot'}`}>
                                {message.text}
                            </div>
                        ))}
                    </div>
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
                        </InputGroup>
                    </Form>
                </Col>
            </Row>
            <Row className="justify-content-md-center">
                <Col xs={12} md={8}>
                    <InputGroup className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Enter a name for this conversation"
                            value={conversationName}
                            onChange={(e) => setConversationName(e.target.value)}
                        />
                        <SaveConversationButton onSaveConversation={saveConversation} />
                    </InputGroup>
                </Col>
            </Row>
        </Container>
    );
}

export default DailyWritingConversation;
