import React from 'react';

const AIGeneratedContentListening = ({ loading, generatedText }) => {
  if (loading) return <p>Loading...</p>;

  if (!generatedText) return <p>No recommendations generated yet.</p>;

  const sections = generatedText.split("**").filter(text => text.trim() !== "");

  let lastTitle = null;

  return (
    <div>
      {sections.map((section, index) => {
        let title;
        if (section.endsWith(":")) {
          if (lastTitle !== section) {
            title = <h3>{section}</h3>;
            lastTitle = section;
          }
        }

        return (
          <div key={index}>
            {title}
            <p>{title ? "" : section}</p>
          </div>
        );
      })}
    </div>
  );
};

export default AIGeneratedContentListening;
