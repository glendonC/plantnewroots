import React, { useState, useEffect } from "react";
import Transition from "../../components/transition/Transition";
import 'bootstrap/dist/css/bootstrap.min.css';
import { US, KR, CN } from 'country-flag-icons/react/3x2';
import { Dropdown } from 'react-bootstrap';
import { LevelList, LevelItem } from './LevelSelectionStyles';
import "./profile.css";


import MagneticButton from "../../components/magneticbutton/MagneticButton";

const Profile = () => {
  const username = localStorage.getItem('username');

  const [selectedLevel, setSelectedLevel] = useState(localStorage.getItem('selectedLevel') || "");

  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    const storedLanguage = localStorage.getItem('selectedLanguage');
    return storedLanguage || 'English';
  });

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
              <form action="">
                <div className="input">
                  <input type="text" placeholder="New Username" />
                </div>
                <div className="input">
                  <input type="text" placeholder="New Email" />
                </div>
                <div className="input">
                  <input type="text" placeholder="New Password" />
                </div>
              </form>
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
                    $isActive={selectedLevel === level} // Using transient prop here
                    onClick={() => handleLevelChange(level)}
                  >
                    {level}
                  </LevelItem>
                ))}
              </LevelList>
            </div>
          </div>
        </section>
       
        <MagneticButton />
      </div>
    </div>
  );
};

export default Transition(Profile);
