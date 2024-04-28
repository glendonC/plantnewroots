import React from 'react';
import './ReportCard.css';

const AIGeneratedContentReading = ({ loading, generatedText }) => {
  if (loading) return <p>Loading...</p>;
  if (!generatedText) return <p>No recommendations generated yet.</p>;

  const sections = generatedText.split('\n').filter(text => text.trim() !== "").map(section => {
    if (section.trim().startsWith('**')) {
      return { type: 'heading', content: section.replace(/\*\*/g, '').trim() };
    } else if (section.trim().startsWith('*')) {
      return { type: 'list', content: section.replace(/\*/g, '').trim() };
    }
    return { type: 'paragraph', content: section.trim() };
  });

  return (
    <div className="report-card">
      {sections.map((section, index) => {
        switch (section.type) {
          case 'heading':
            return <h3 key={index}>{section.content}</h3>;
          case 'list':
            return <ul key={index}><li>{section.content}</li></ul>;
          case 'paragraph':
          default:
            return <p key={index}>{section.content}</p>;
        }
      })}
    </div>
  );
};

export default AIGeneratedContentReading;
