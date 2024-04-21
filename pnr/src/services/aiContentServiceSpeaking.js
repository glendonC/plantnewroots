import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const generateAIContentSpeaking = async (transcript, feedback) => {
  if (!transcript || !feedback) {
    console.error("Data for generating AI content for speaking is incomplete.");
    return '';
  }

  const prompt = `
    Given the provided transcript and user feedback, perform a comprehensive analysis focusing on spoken language proficiency:
    
    Transcript: "${transcript}"
    
    Feedback: ${feedback}
    
    Analyze the user's spoken responses for pronunciation accuracy, fluency, grammatical correctness, and appropriateness of vocabulary. Provide specific exercises to correct any mistakes, offer tips to enhance their speaking abilities, and encourage continuous learning with positive reinforcement.
    
    Summarize the overall language ability demonstrated by the user and suggest focused activities to improve their speaking skills in the target language.
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
