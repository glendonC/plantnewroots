import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useStory } from "../../contexts/StoryContext";
import { useLevelLanguage } from "../../contexts/LevelLanguageContext";
import Transition from "../../components/transition/Transition";
import HomeButton from "../../components/homebutton/HomeButton";
import Loader from 'react-loaders';
import 'loaders.css/loaders.min.css';
import "./sample-blog.css";
import { Button } from 'react-bootstrap';

function SampleBlog() {
  const { id } = useParams();
  const { story } = useStory();
  const { title, subtitle } = story;
  const { selectedLevel, selectedLanguage } = useLevelLanguage();
  const [content, setContent] = useState('');
  const [userQuestion, setUserQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateContent = async () => {
      setLoading(true);
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      let prompt = '';
      const levelDescriptor = selectedLevel;

      switch (title.toLowerCase()) {
        case "learning new words":
          prompt = `Generate 5 ${levelDescriptor} verbs, nouns, and adjectives and provide an example sentence for each in ${selectedLanguage}.`;
          break;
        case "learning new grammar":
          prompt = `Explain 5 ${levelDescriptor} grammar points focusing on tense usage and conjunctions. Provide a clear explanation and an example of each in ${selectedLanguage}.`;
          break;
        case "exploring culture":
          prompt = `Describe a significant cultural festival in ${selectedLanguage} in 5-10 sentences. Explain its importance and provide the translation of key terms in English if ${selectedLanguage} isn't English.`;
          break;
        default:
          prompt = `Create a ${levelDescriptor} lesson around the topic "${title}" focusing on ${subtitle}, tailored to a ${selectedLanguage} language learner.`;
          break;
      }

      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const generatedText = await response.text();
        setContent(generatedText);
      } catch (error) {
        console.error('Error generating content:', error);
        setContent('Failed to load story content.');
      } finally {
        setLoading(false);
      }
    };

    generateContent();
  }, [id, title, subtitle, selectedLanguage]);

  const handleUserQuestion = async (event) => {
    event.preventDefault();
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
    const conversationalPrompt = `
      Imagine you're a language coach providing a detailed explanation to a student. The student has asked: "${userQuestion}"
      Please respond in a friendly and helpful manner, using simple examples or analogies where possible to clarify your explanation. Assume the student has a basic understanding of the topic and tailor your response to encourage learning and curiosity.
    `;
  
    try {
      const result = await model.generateContent(conversationalPrompt);
      const response = await result.response;
      setAiResponse(await response.text());
    } catch (error) {
      console.error('Error responding to user question:', error);
      setAiResponse('Failed to respond to your question.');
    }
  };
  

  return (
    <div className="sample-blog page">
      <div className="container">
        <div className="s-blog-hero">
          <h2>{title || "Default Title"}</h2>
        </div>
        {loading ? (
          <div className="loader-container">
            <Loader type="ball-scale-ripple-multiple" />
          </div>
        ) : (
          <div className="blog-content">
            <div className="s-blog-col scroll">
              <p><span>{subtitle || "Default Subtitle"}</span></p>
              <br />
              {content.split('\n\n').map((paragraph, index) => (
                <React.Fragment key={index}>
                  {paragraph.split('\n').map((line, lineIndex) => {
                    if (line.startsWith('**')) {
                      return <h3 key={lineIndex}>{line.replace(/\*\*/g, '').trim()}</h3>;
                    } else if (line.startsWith('*')) {
                      return <li key={lineIndex}>{line.replace(/\*/g, '').trim()}</li>;
                    }
                    return <p key={lineIndex}>{line}</p>;
                  })}
                  <br /><br />
                </React.Fragment>
              ))}
            </div>
            <div className="s-blog-col sticky">
              <form onSubmit={handleUserQuestion}>
                <textarea
                  value={userQuestion}
                  onChange={(e) => setUserQuestion(e.target.value)}
                  placeholder="Ask me anything about the content..."
                  rows="5"
                  style={{ width: '100%' }}
                />
                <Button type="submit" variant="primary" style={{ marginTop: '10px' }}>Ask Gemini!</Button>
                {aiResponse && <p style={{ marginTop: '10px' }}>{aiResponse}</p>}
              </form>
            </div>
          </div>
        )}
        <HomeButton />
      </div>
    </div>
  );
}

export default Transition(SampleBlog);
