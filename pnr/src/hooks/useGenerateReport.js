import { useCallback, useState, useRef } from 'react';
import axios from '../axios';

const useGenerateReport = (sessionId, sessionType, token) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedText, setGeneratedText] = useState('');
  const fetchAttempted = useRef(false);

  const createAIPrompt = (sessionType, generalReport, detailedAnalysis, userMessages) => {
    let prompt = `Analyze the following ${sessionType} session data and provide specific feedback and recommendations for improvement:\n\n`;
  
    prompt += `General Analysis:\n- Average Sentiment Score: ${generalReport.sentimentScoreAverage} (${generalReport.sentimentScoreAverage < 0 ? "negative" : "positive or neutral"} tone)\n`;
    prompt += `- Number of Analyses Conducted: ${generalReport.analysisCount}\n\n`;
  
    prompt += `Detailed Analysis Findings:\n`;
    detailedAnalysis.forEach((issue, index) => {
      prompt += `${index + 1}. ${issue.aspect}: ${issue.feedback}\n`;
    });
  
    prompt += `\nExamples from the ${sessionType}:\n`;
    userMessages.forEach((msg, index) => {
      prompt += `${index + 1}. "${msg.text}"\n`;
    });
  
    prompt += `\nBased on the above analysis and examples, provide specific feedback and actionable recommendations for the user to improve their ${sessionType === 'writing' ? 'writing' : 'reading'} skills. Focus on aspects such as grammar, style, vocabulary, and engagement.`;
  
    return prompt;
  };
  
  const generateAIContent = async (sessionType, generalReportData, detailedAnalysisData, userMessages) => {
    setLoading(true);

    try {
      const prompt = createAIPrompt(sessionType, generalReportData, detailedAnalysisData, userMessages);
      console.log("Generated AI Prompt:", prompt);

      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const result = await model.generateContent(prompt);
      const text = result.response.text;

      console.log("AI Generated Text:", text);
      setGeneratedText(text);

      // Save the newly generated report
      await axios.post(`/api/${sessionType}Analysis/saveGeneratedText`, {
          sessionId,
          generatedText: text
      }, {
          headers: { 'Authorization': `Bearer ${token}` }
      });

    } catch (error) {
      console.error('Error generating AI content:', error);
      setError(error.toString());
    } finally {
      setLoading(false);
    }
  };
  
  const fetchReportData = useCallback(async () => {
    if (!sessionId || fetchAttempted.current) {
      return;
    }
    setLoading(true);
    setError(null);
    const baseURL = `/api/${sessionType}Analysis`;
    fetchAttempted.current = true;

    try {
      const savedResponse = await axios.get(`${baseURL}/${sessionId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (savedResponse.data && savedResponse.data.generatedText) {
        setGeneratedText(savedResponse.data.generatedText);
      } else {
        console.log('No saved report available, generating new one.');
        const [generalReport, detailedAnalysis, userMessages] = await Promise.all([
          axios.get(`${baseURL}/report/${sessionId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          axios.post(`${baseURL}/analyze`, { sessionId }, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          axios.get(`/api/${sessionType}Conversations/userMessages/${sessionId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        console.log("General Report:", generalReport.data);
        console.log("Detailed Analysis:", detailedAnalysis.data);
        console.log("User Messages:", userMessages.data);

        if (!generalReport.data || !detailedAnalysis.data || !userMessages.data || userMessages.data.messages.length === 0) {
          throw new Error('Data for generating AI content is incomplete.');
        }

        await generateAIContent(sessionType, generalReport.data, detailedAnalysis.data, userMessages.data.messages);
      }
    } catch (error) {
      console.error('Error fetching data for AI content generation:', error);
      setError(error.toString());
    } finally {
      setLoading(false);
    }
  }, [sessionId, sessionType, token, generateAIContent]);

  return { loading, generatedText, error, fetchReportData };
};

export default useGenerateReport;
