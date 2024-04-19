import React from 'react';

const AIGeneratedContentReading = ({ loading, generatedText }) => {
  if (loading) return <p>Loading...</p>;
  return (
    <div>
      <p>{generatedText}</p>
    </div>
  );
};

export default AIGeneratedContentReading;
