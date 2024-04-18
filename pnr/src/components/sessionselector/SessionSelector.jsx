import React from 'react';
import { Dropdown } from 'react-bootstrap';

const SessionSelector = ({
    writingSessions = [], 
    readingSessions = [],
    onSessionSelect,
    selectedSessionId
}) => {
    return (
        <>
            <h3>Select Writing Conversation:</h3>
            <Dropdown onSelect={(eventKey) => onSessionSelect(eventKey, 'writing')}>
                <Dropdown.Toggle variant="primary" id="writing-dropdown">
                    {selectedSessionId ? writingSessions.find(session => session.sessionId === selectedSessionId)?.name : 'Select a writing conversation'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {writingSessions.map(session => ([
                        <Dropdown.Item key={`${session.sessionId}-full`} eventKey={session.sessionId}>
    {session.name} - Full Conversation
</Dropdown.Item>,
<Dropdown.Item key={`${session.sessionId}-user`} eventKey={session.sessionId}>
    {session.name} - User Messages
</Dropdown.Item>

                    ]))}
                </Dropdown.Menu>
            </Dropdown>

            <h3>Select Reading Session:</h3>
            <Dropdown onSelect={(eventKey) => onSessionSelect(eventKey, 'reading')}>
                <Dropdown.Toggle variant="secondary" id="reading-dropdown">
                    {selectedSessionId ? readingSessions.find(session => session.sessionId === selectedSessionId)?.name : 'Select a reading session'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {readingSessions.map(session => ([
                        <Dropdown.Item key={`${session.sessionId}-full`} eventKey={session.sessionId}>
    {session.name} - Full Conversation
</Dropdown.Item>,
<Dropdown.Item key={`${session.sessionId}-user`} eventKey={session.sessionId}>
    {session.name} - User Messages
</Dropdown.Item>

                    ]))}
                </Dropdown.Menu>
            </Dropdown>
        </>
    );
};

export default SessionSelector;
