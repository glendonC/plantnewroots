import React from 'react';
import { Dropdown } from 'react-bootstrap';

function ConversationSelector({ conversations, selectedConversationId, onSelect }) {
  const groupedConversations = conversations.reduce((acc, conversation) => {
    acc[conversation.type] = [...(acc[conversation.type] || []), conversation];
    return acc;
  }, {});

  return (
    <Dropdown onSelect={onSelect}>
      <Dropdown.Toggle variant="primary" id="conversation-dropdown">
        {selectedConversationId
          ? conversations.find(conversation => conversation._id === selectedConversationId)?.name
          : 'Select a conversation'}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {Object.entries(groupedConversations).map(([type, conversations]) => (
          <React.Fragment key={type}>
            <Dropdown.ItemText>{type.toUpperCase()}</Dropdown.ItemText>
            {conversations.map(conversation => (
              <Dropdown.Item key={conversation._id} eventKey={conversation._id}>
                {conversation.name} - {conversation.type === 'reading' ? 'Reading' : conversation.tag}
              </Dropdown.Item>
            ))}
          </React.Fragment>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default ConversationSelector;
