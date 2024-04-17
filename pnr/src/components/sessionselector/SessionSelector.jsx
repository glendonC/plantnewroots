import React from 'react';
import { Dropdown } from 'react-bootstrap';

const SessionSelector = ({
    writingSessions = [], 
    readingSessions = [],
    onWritingSessionSelect,
    onReadingSessionSelect,
    selectedWritingSessionId,
    selectedReadingSessionId
}) => {
    return (
        <>
            <h3>Select Writing Conversation:</h3>
            <Dropdown onSelect={onWritingSessionSelect}>
                <Dropdown.Toggle variant="primary" id="writing-dropdown">
                    {selectedWritingSessionId ? writingSessions.find(session => session._id === selectedWritingSessionId)?.name : 'Select a writing conversation'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {writingSessions && writingSessions.map(session => (
                        <Dropdown.Item key={session._id} eventKey={session._id}>
                            {session.name} - {session.tag}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>

            <h3>Select Reading Session:</h3>
            <Dropdown onSelect={onReadingSessionSelect}>
                <Dropdown.Toggle variant="secondary" id="reading-dropdown">
                    {selectedReadingSessionId ? readingSessions.find(session => session._id === selectedReadingSessionId)?.name : 'Select a reading session'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {readingSessions && readingSessions.map(session => (
                        <Dropdown.Item key={session._id} eventKey={session._id}>
                            {session.name}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        </>
    );
};

export default SessionSelector;
