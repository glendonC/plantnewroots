import React, { useState } from 'react';
import axios from 'axios';
import './dailywritingconversation.css';


import SaveConversationButton from '../../../components/saveconversationbutton/SaveConversationButton';

function DailyWritingConversation() {
    const [userInput, setUserInput] = useState('');
    const [messages, setMessages] = useState([]);

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

    const handleInputChange = (e) => {
        setUserInput(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    const saveConversation = async () => {
        const userId = localStorage.getItem('userId');
        const botId = '660a88e076ab4670bfd0bfc6';
    
        const payload = {
            participants: [userId, botId],
            messages: messages.map(message => ({
                ...message,
                from: message.from === 'user' ? userId : botId,
            }))
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
    
        try {
            await axios.post('/api/writingConversations/userMessages/save', {
                userId,
                conversationId,
                messages: userMessages,
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
    
    
      
    return (
        <div className="daily-conversation-container">
            <h2>Daily Writing Conversation Practice</h2>
            <div className="messages-container">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.from}`}>
                        {message.text}
                    </div>
                ))}
            </div>
            <div className="input-container">
                <input
                    type="text"
                    value={userInput}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message here..."
                />
                <button onClick={sendMessage}>Send</button>
            </div>
            <SaveConversationButton onSaveConversation={saveConversation} />
        </div>
    );
    
}

export default DailyWritingConversation;
