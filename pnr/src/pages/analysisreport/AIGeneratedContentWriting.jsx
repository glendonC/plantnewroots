import React from 'react';
import Loader from 'react-loaders'
import 'loaders.css/loaders.min.css';
import './ReportCard.css';

function AIGeneratedContent({ loading, generatedText }) {
  const formatAIGeneratedTextWriting = (generatedText) => {
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

  return (
    <>
      {loading ? (
                <div className="loader-active">
                    <Loader type="ball-scale-ripple-multiple" active />
                </div>
            ) : (
        generatedText ? (
          <div>
            <h2>Writing Analysis</h2>
            {formatAIGeneratedTextWriting(generatedText)}
          </div>
        ) : (
          <p>No recommendations generated yet.</p>
        )
      )}
    </>
  );
}

export default AIGeneratedContent;
