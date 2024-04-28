import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const generateAIContentListening = async (text, feedback) => {
  if (!text || !feedback) {
    console.error("Data for generating AI content for listening is incomplete.");
    return '';
  }

  const prompt = `
    Based on the provided audio text and user feedback, create a personalized and conversational report card focusing on listening comprehension, pronunciation, and vocabulary usage:
    
    Audio Text: "${text}"
    
    Feedback: ${feedback}
    
    Please generate feedback as if you are a coach directly addressing the student. Use a friendly and encouraging tone and cover the following:
    - Comment on the user's listening comprehension and pronunciation accuracy.
    - Highlight specific areas of vocabulary strength and areas for improvement.
    - Recommend targeted exercises to enhance pronunciation and listening skills.
    - Offer practical tips for improving listening habits and strategies.
    - Provide positive reinforcement focusing on what the user did well.
    - Summarize the user's overall listening ability and suggest focused activities to improve their skills further.
    
    Ensure the feedback feels like a one-on-one session, aiming to motivate and guide the user in their language learning journey.
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
