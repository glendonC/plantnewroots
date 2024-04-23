import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const generateAIContentSpeaking = async (transcript, response) => {
  if (!transcript || !response) {
    console.error("Data for generating AI content for speaking is incomplete.");
    return '';
  }
  const prompt = createAIPromptSpeaking(transcript, response);

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

const createAIPromptSpeaking = (transcript, response) => {
  let prompt = `Provide a detailed analysis of the spoken language used in the following transcript, focusing on aspects such as pronunciation accuracy, fluency, grammatical correctness, and appropriateness of vocabulary. Also, use the feedback provided to offer specific exercises or tips to improve speaking skills.\n\n`;

  prompt += `Transcript: "${transcript}"\n`;
  prompt += `Feedback: ${response}\n\n`;

  prompt += `Based on the transcript and feedback, generate a comprehensive report detailing strengths, weaknesses, and specific recommendations for enhancing the speaker's language proficiency.`;

  return prompt;
};
