import React from 'react';

const AIGeneratedContentReading = ({ loading, generatedText }) => {
  if (loading) return <p>Loading...</p>;
  return (
    <div>
      <h3>Reading Content Analysis</h3>
      <p>{generatedText}</p>
    </div>
  );
};

export default AIGeneratedContentReading;
