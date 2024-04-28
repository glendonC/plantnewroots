import React, { useState, useEffect } from "react";
import Transition from "../../components/transition/Transition";
import { US, KR, CN } from 'country-flag-icons/react/3x2';
import { Dropdown, Modal, Button } from 'react-bootstrap';
import { LevelList, LevelItem } from './LevelSelectionStyles';
import "./profile.css";
import axios from 'axios';

import HomeButton from "../../components/homebutton/HomeButton";

const Profile = () => {
  const username = localStorage.getItem('username');

  const [selectedLevel, setSelectedLevel] = useState(localStorage.getItem('selectedLevel') || "");

  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('success');

  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    const storedLanguage = localStorage.getItem('selectedLanguage');
    return storedLanguage || 'English';
  });

  const handleUsernameChange = (event) => {
    setNewUsername(event.target.value);
  };
  
  const handleEmailChange = (event) => {
    setNewEmail(event.target.value);
  };
  
  const handlePasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
        const token = localStorage.getItem('token');

        const response = await axios.post('/api/users/update-profile', {
            username: newUsername,
            email: newEmail,
            password: newPassword
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        setModalType('success');
            setModalMessage('Profile updated successfully');
            setShowModal(true);
    
    } catch (error) {
      setModalType('error');
      setModalMessage('Error updating profile');
      setShowModal(true);
    }
  };

  
  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    localStorage.setItem('selectedLanguage', language);
  };
  
  const handleLevelChange = (level) => {
    setSelectedLevel(level);
    localStorage.setItem('selectedLevel', level);
  };

  React.useEffect(() => {
    const savedLevel = localStorage.getItem('selectedLevel');
    if (savedLevel) {
      setSelectedLevel(savedLevel);
    }
  }, []); 

  useEffect(() => {
    const savedLevel = localStorage.getItem('selectedLevel');
    if (savedLevel) {
      setSelectedLevel(savedLevel);
    }
  }, []);
  
  const languageFlags = {
    English: <US className="flag-icon" />,
    Korean: <KR className="flag-icon" />,
    Chinese: <CN className="flag-icon" />,
  };
  
  const SelectedFlag = languageFlags[selectedLanguage];

  return (
    <div className="contact page">
      <div className="container">
        <section className="contact-hero">
          <div className="contact-row">
            <div className="contact-col"></div>
            <div className="contact-col">
              <h1>
                Welcome, <span>{username}</span>
              </h1>
            </div>
          </div>
        </section>

        <section className="section contact-form">
          <div className="contact-row">
            <div className="contact-col">
              <p>
                <span>Update Profile</span>
              </p>
            </div>
            <div className="contact-col">
              <form onSubmit={handleSubmit}>
                <input type="text" placeholder="New Username" value={newUsername} onChange={handleUsernameChange} />
                <input type="text" placeholder="New Email" value={newEmail} onChange={handleEmailChange} />
                <input type="text" placeholder="New Password" value={newPassword} onChange={handlePasswordChange} />
                <Button variant="light" style={{ backgroundColor: 'transparent', marginTop: '10px', marginLeft: '-10px' }} onClick={handleSubmit}>
                  Update Profile
                </Button>
              </form>
              <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalType === 'success' ? 'Success' : 'Error'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalMessage}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal} style={{ color: 'black' }}>
                        Close
                    </Button>
                </Modal.Footer>
              </Modal>
            </div>
          </div>
        </section>

        <section className="section contact-form">
          <div className="contact-row">
            <div className="contact-col">
              <p>
                <span>Select a language to study</span>
              </p>
            </div>
            <div className="contact-col">
              <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  {SelectedFlag}
                  {selectedLanguage}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => {
                    setSelectedLanguage('English');
                    handleLanguageSelect('English');
                  }}>
                    {languageFlags['English']}
                    English
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => {
                    setSelectedLanguage('Korean');
                    handleLanguageSelect('Korean');
                  }}>
                    {languageFlags['Korean']}
                    Korean
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => {
                    setSelectedLanguage('Chinese');
                    handleLanguageSelect('Chinese');
                  }}>
                    {languageFlags['Chinese']}
                    Chinese
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </section>

        <section className="contact-subscribe">
          <div className="contact-row">
            <div className="contact-col">
              <p><span>Select Desired Content Level</span></p>
            </div>
            <div className="contact-col">
              <h3>Choose a level that you would like your content to reflect</h3>
              <p>Your growth starts with failure and learning from it.</p>
              <LevelList>
                {["Beginner", "Elementary", "Intermediate", "Advanced", "Fluent"].map((level) => (
                  <LevelItem
                    key={level}
                    $isActive={selectedLevel === level}
                    onClick={() => handleLevelChange(level)}
                  >
                    {level}
                  </LevelItem>
                ))}
              </LevelList>
            </div>
          </div>
        </section>
       
        <HomeButton />
      </div>
    </div>
  );
};

export default Transition(Profile);
