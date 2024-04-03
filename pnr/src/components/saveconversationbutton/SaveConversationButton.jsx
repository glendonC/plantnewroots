import React from 'react';
import './saveconversationbutton.css';

const SaveConversationButton = ({ onSaveConversation }) => {
    return (
        <button className="save-conversation-btn" onClick={onSaveConversation}>
            Save Conversation
        </button>
    );
};

export default SaveConversationButton;
