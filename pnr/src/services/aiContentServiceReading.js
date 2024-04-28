import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const generateAIContentReading = async (text, feedback) => {
  if (!text || !feedback) {
    console.error("Data for generating AI content for reading is incomplete.");
    return '';
  }

  const prompt = `
    Given the provided text and user feedback, synthesize a concise analysis in the form of a personalized, conversational report card. Discuss the following key areas: Language Comprehension, Grammar, Vocabulary, and provide targeted exercises and practical tips:

    Text: "${text}"

    Feedback: ${feedback}

    Format your response as if you are a coach providing warm, encouraging, and direct feedback to a student. Use a friendly tone and address the user directly with advice on how they can improve. Include:
    - A personalized greeting and introduction.
    - Direct comments on their specific strengths and areas needing improvement.
    - Suggestions for exercises as if you are explaining them face-to-face.
    - Practical tips that feel like direct advice from a mentor.
    - Positive reinforcement that highlights their efforts and progress.
    - A concluding remark that encourages them to continue improving.

    Aim to make the report feel like a one-on-one session between a tutor and a student.
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