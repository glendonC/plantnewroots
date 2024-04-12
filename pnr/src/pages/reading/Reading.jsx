import React, { useState, useEffect } from "react";
import { useLevelLanguage } from "../../contexts/LevelLanguageContext";
import MagneticButton from "../../components/magneticbutton/MagneticButton";
import Transition from "../../components/transition/Transition";

const Reading = () => {
  const { selectedLevel, selectedLanguage } = useLevelLanguage();
  const [textLength, setTextLength] = useState('');
  const [content, setContent] = useState({ text: "", questions: [] });
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState("");
  const generateContent = async () => {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    let textPrompt = `Generate a detailed, factual ${textLength} story suitable for a ${selectedLevel} level student in ${selectedLanguage}.`;
    
    try {
      const textResult = await model.generateContent(textPrompt);
      const textResponse = await textResult.response;
      const generatedText = await textResponse.text();
      setContent({ text: generatedText, questions: [] });
      await generateQuestions(generatedText);
    } catch (error) {
      console.error('Error generating content:', error);
      setContent({ text: "Failed to generate content.", questions: [] });
    }
  };
  
  const generateQuestions = async (text) => {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    let questionPrompt = `Based on the following text: "${text}", generate three direct questions that can be clearly answered from the text.`;

    try {
      const questionResult = await model.generateContent(questionPrompt);
      const questionResponse = await questionResult.response;
      const questionsText = await questionResponse.text();
      const questions = questionsText.split("\n").filter(q => q).map(query => ({ query }));
      setContent(prev => ({ ...prev, questions }));
    } catch (error) {
      console.error('Error generating questions:', error);
      setContent(prev => ({ ...prev, questions: [] }));
    }
  };
  

  const handleAnswerChange = (index, value) => {
    setAnswers(prev => ({ ...prev, [index]: value }));
  };

  const submitAnswers = async () => {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `The text provided is: "${content.text}". Evaluate the following answers based on the text and questions provided: ${
      content.questions.map((q, i) => `Question: ${q.query}, Answer: ${answers[i] || 'no answer provided'}`).join("; ")
    }.`;
  
    console.log("Sending this prompt to AI:", prompt);
  
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const evaluation = await response.text();
      setFeedback(evaluation);
    } catch (error) {
      console.error('Error evaluating answers:', error);
      setFeedback("Failed to evaluate answers.");
    }
  };
  
  

  return (
    <div className="reading-page">
      <h1>Reading Exercise</h1>
      <p>Select text length:</p>
      <select value={textLength} onChange={(e) => setTextLength(e.target.value)}>
        <option value="">Select a length</option>
        <option value="short">Short</option>
        <option value="medium">Medium</option>
        <option value="long">Long</option>
      </select>
      <button onClick={generateContent} disabled={!textLength} style={{ backgroundColor: textLength ? '#00f' : '#aaa' }}>
        Generate Text
      </button>
      <div className="content-section">
        <h2>Text for Reading</h2>
        <p>{content.text}</p>
        {content.questions.map((question, index) => (
          <div key={index}>
            <p>{question.query}</p>
            <input
              type="text"
              placeholder="Your answer..."
              value={answers[index] || ''}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
            />
          </div>
        ))}
      </div>
      <button onClick={submitAnswers}>Submit Answers</button>
      {feedback && <p>{feedback}</p>}
      <MagneticButton />
    </div>
  );
};

export default Transition(Reading);
