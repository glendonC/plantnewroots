import React, { createContext, useContext, useState } from 'react';

const TargetLanguageContext = createContext();

export const useTargetLanguage = () => useContext(TargetLanguageContext);

export const TargetLanguageProvider = ({ children }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem('selectedLanguage') || 'English');

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    localStorage.setItem('selectedLanguage', language);
  };

  return (
    <TargetLanguageContext.Provider value={{ selectedLanguage, handleLanguageChange }}>
      {children}
    </TargetLanguageContext.Provider>
  );
};
