import React, { createContext, useContext, useState, useEffect } from 'react';

const LevelContext = createContext();

export const useLevel = () => useContext(LevelContext);

export const LevelProvider = ({ children }) => {
  const [selectedLevel, setSelectedLevel] = useState(localStorage.getItem('selectedLevel') || '');

  useEffect(() => {
    const savedLevel = localStorage.getItem('selectedLevel');
    if (savedLevel) {
      setSelectedLevel(savedLevel);
    }
  }, []);

  const handleLevelChange = (level) => {
    setSelectedLevel(level);
    localStorage.setItem('selectedLevel', level);
  };

  return (
    <LevelContext.Provider value={{ selectedLevel, handleLevelChange }}>
      {children}
    </LevelContext.Provider>
  );
};
