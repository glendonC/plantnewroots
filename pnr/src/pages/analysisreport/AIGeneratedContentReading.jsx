import React from 'react';
import Loader from 'react-loaders'
import 'loaders.css/loaders.min.css';
import './ReportCard.css';

const AIGeneratedContentReading = ({ loading, generatedText }) => {
  if (loading) {
    return (
      <div className="loader-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loader type="ball-scale-ripple-multiple" />
      </div>
    );
  }
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
