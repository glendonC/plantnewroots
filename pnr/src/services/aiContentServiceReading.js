import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const generateAIContentReading = async (text, feedback) => {
  if (!text || !feedback) {
    console.error("Data for generating AI content for reading is incomplete.");
    return '';
  }

  const prompt = `
    Given the provided text and user feedback, perform a comprehensive analysis focusing on language comprehension, accuracy, and areas for improvement:
    
    Text: "${text}"
    
    Feedback: ${feedback}
    
    Analyze the user's responses for grammar accuracy, vocabulary appropriateness, and comprehension of the text's context. Provide specific exercises to address any mistakes, offer tips to enhance their understanding of similar texts in the future, and encourage continuous learning with positive reinforcement.
    
    Summarize the overall language ability demonstrated by the user and suggest focused activities to improve their reading and comprehension skills in the target language.
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