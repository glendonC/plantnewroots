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
  let prompt = `As a language coach, provide a detailed and personalized feedback report on the following transcript, focusing on pronunciation accuracy, fluency, grammatical correctness, and vocabulary appropriateness. Use the feedback given to offer specific exercises or tips that will help improve the speaker's skills. Make sure your feedback is engaging, motivational, and easy to understand for someone looking to enhance their speaking abilities.\n\n`;

  prompt += `Transcript: "${transcript}"\n`;
  prompt += `Feedback: ${response}\n\n`;

  prompt += `Please address the user directly, offering constructive criticism and clear guidance. Highlight specific strengths and areas for improvement, and recommend practical exercises that can be easily integrated into daily practice. Conclude with positive reinforcement that encourages persistence and confidence in their language learning journey.`;

  return prompt;
};

