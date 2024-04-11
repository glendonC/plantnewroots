import React, { createContext, useContext, useState } from 'react';

const StoryContext = createContext();

export const useStory = () => useContext(StoryContext);

export const StoryProvider = ({ children }) => {
  const [story, setStory] = useState({});

  return (
    <StoryContext.Provider value={{ story, setStory }}>
      {children}
    </StoryContext.Provider>
  );
};
