import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const generateAIContentListening = async (text, feedback) => {
  if (!text || !feedback) {
    console.error("Data for generating AI content for listening is incomplete.");
    return '';
  }

  const prompt = `
    Given the provided audio text and user feedback, perform a comprehensive analysis focusing on listening comprehension, pronunciation understanding, and areas for improvement:
    
    Audio Text: "${text}"
    
    Feedback: ${feedback}
    
    Analyze the user's responses for pronunciation accuracy, vocabulary comprehension, and understanding of the audio's context. Provide specific exercises to address any pronunciation errors, offer tips to enhance their listening skills for similar audio in the future, and encourage continuous learning with positive reinforcement.
    
    Summarize the overall language ability demonstrated by the user and suggest focused activities to improve their listening and comprehension skills in the target language.
  `;

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysisText = await response.text();
    return analysisText;
  } catch (error) {
    console.error('Error loading GoogleGenerativeAI or generating content:', error);
    return '';
  }
};
