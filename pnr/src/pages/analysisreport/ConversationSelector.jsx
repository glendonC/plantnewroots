import React from 'react';
import { Dropdown } from 'react-bootstrap';

function ConversationSelector({ conversations, selectedConversationId, onSelect }) {
  return (
    <Dropdown onSelect={onSelect}>
      <Dropdown.Toggle variant="primary" id="conversation-dropdown">
        {selectedConversationId
          ? conversations.find(conversation => conversation._id === selectedConversationId)?.name
          : 'Select a conversation'}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {conversations.map(conversation => (
          <Dropdown.Item key={conversation._id} eventKey={conversation._id}>
            {conversation.name} - {conversation.tag}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default ConversationSelector;