import React from 'react';
import { Dropdown } from 'react-bootstrap';

function ConversationSelector({ conversations, selectedConversationId, onSelect }) {
  const groupedConversations = conversations.reduce((acc, conversation) => {
    const uniqueKey = `${conversation.name}-${conversation.tag}`;
    acc[conversation.type] = acc[conversation.type] || {};

    if (!acc[conversation.type][uniqueKey]) {
      acc[conversation.type][uniqueKey] = conversation;
    }
    
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
            {Object.values(conversations).map(conversation => (
              <Dropdown.Item key={conversation._id} eventKey={conversation._id}>
                {conversation.name} - {type === 'reading' ? 'Reading' : conversation.tag}
              </Dropdown.Item>
            ))}
          </React.Fragment>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default ConversationSelector;
