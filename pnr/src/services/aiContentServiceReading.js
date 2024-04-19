import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const generateAIContentReading = async (readingText, questions, userAnswers) => {
    if (!readingText || questions.length === 0 || userAnswers.length === 0) {
      console.error("Data for generating AI content for reading is incomplete.");
      return '';
    }
  
    const prompt = createAIPromptReading(readingText, questions, userAnswers);
  
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();
      return text;
    } catch (error) {
      console.error('Error loading GoogleGenerativeAI or generating content:', error);
      return '';
    }
  };
  
  const createAIPromptReading = (readingText, questions, userAnswers) => {
    let prompt = `Given the following reading passage and user responses, provide a detailed analysis of user comprehension and accuracy in answers:\n\n`;
    prompt += `Reading Passage:\n"${readingText}"\n\n`;
    prompt += `Questions and User Responses:\n`;
  
    questions.forEach((question, index) => {
      prompt += `${index + 1}. Question: "${question.text}" - User Answer: "${userAnswers[index] || 'No answer provided'}"\n`;
    });
  
    prompt += `\nProvide specific feedback on the user's understanding of the text, correctness of their answers, and suggest areas for improvement in reading comprehension and analysis skills.`;
  
    return prompt;
  };
  
  