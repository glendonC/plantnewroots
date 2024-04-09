import React, { createContext, useContext, useState, useEffect } from 'react';
const LevelLanguageContext = createContext();

export const useLevelLanguage = () => useContext(LevelLanguageContext);

export const LevelLanguageProvider = ({ children }) => {
  const [selectedLevel, setSelectedLevel] = useState(localStorage.getItem('selectedLevel') || '');
  const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem('selectedLanguage') || 'English');

  useEffect(() => {
    const savedLevel = localStorage.getItem('selectedLevel');
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLevel) {
      setSelectedLevel(savedLevel);
    }
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage);
    }
  }, []);

  const handleLevelChange = (level) => {
    setSelectedLevel(level);
    localStorage.setItem('selectedLevel', level);
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    localStorage.setItem('selectedLanguage', language);
  };

  return (
    <LevelLanguageContext.Provider value={{ selectedLevel, selectedLanguage, handleLevelChange, handleLanguageChange }}>
      {children}
    </LevelLanguageContext.Provider>
  );
};
