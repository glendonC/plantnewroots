import React from 'react';

function AIGeneratedContentSpeaking({ loading, generatedText }) {
  const formatAIGeneratedTextSpeaking = (generatedText) => {
    const sections = generatedText.split("**").filter(text => text.trim() !== "");
    
    return (
      <>
        {sections.map((section, index) => {
          if (section.startsWith("General Analysis:") || section.startsWith("Detailed Analysis Findings:")) {
            return <h3 key={index}>{section}</h3>;
          } else if (section.startsWith("Examples from the conversation:")) {
            const messages = section.split("\n").filter(text => text.trim() !== "" && !text.startsWith("Examples from"));
            return (
              <div key={index}>
                <h4>Examples from the conversation:</h4>
                <ul>
                  {messages.map((msg, msgIndex) => (
                    <li key={msgIndex}>{msg}</li>
                  ))}
                </ul>
              </div>
            );
          } else if (section.startsWith("Personalized Recommendations:") || section.startsWith("Overall Improvement Tips:")) {
            const items = section.split("*").filter(text => text.trim() !== "");
            return (
              <div key={index}>
                <h4>{items.shift()}</h4>
                <ul>
                  {items.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              </div>
            );
          } else {
            return <p key={index} style={{ color: 'white' }}>{section}</p>;
          }
        })}
      </>
    );
  };

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {generatedText ? (
            <div>
              <h2>Generated Recommendations</h2>
              {formatAIGeneratedTextSpeaking(generatedText)}
            </div>
          ) : (
            <p>No recommendations generated yet.</p>
          )}
        </>
      )}
    </>
  );
}

export default AIGeneratedContentSpeaking;