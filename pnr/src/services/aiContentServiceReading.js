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

    Please categorize your analysis as follows:
    - Grammar Accuracy: [Detail the errors and suggestions]
    - Vocabulary Appropriateness: [Detail the use and recommendations]
    - Comprehension of Context: [Evaluate comprehension and provide examples]
    - Exercises and Tips: [Suggest specific exercises and tips for improvement]

    Summarize the overall language ability demonstrated and suggest focused activities to improve their skills.
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