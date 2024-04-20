import React from 'react';

const AIGeneratedContentReading = ({ loading, generatedText }) => {
  if (loading) return <p>Loading...</p>;
  if (!generatedText) return <p>No recommendations generated yet.</p>;
  const sections = generatedText.split("**").filter(text => text.trim() !== "");

  return (
    <div>
      {sections.map((section, index) => (
        <div key={index}>
          <p>{section}</p>
        </div>
      ))}
    </div>
  );
};

export default AIGeneratedContentReading;
