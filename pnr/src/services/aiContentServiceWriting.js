import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const generateAIContentWriting = async (generalWritingReportData, detailedWritingAnalysisData, userMessages) => {
  if (!generalWritingReportData || !detailedWritingAnalysisData || userMessages.length === 0) {
    console.error("Data for generating AI content is incomplete.");
    return '';
  }
  const prompt = createAIPromptWriting(generalWritingReportData, detailedWritingAnalysisData, userMessages);

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

const createAIPromptWriting = (generalReport, detailedAnalysis, userMessages) => {
  let prompt = `As a writing coach, provide a detailed and personalized feedback report based on the user's writing data. Analyze the given information and discuss specific areas such as grammar, style, vocabulary, and engagement. Use a friendly and encouraging tone to deliver constructive criticism and practical advice.\n\n`;

  prompt += `General Analysis:\n- Average Sentiment Score: ${generalReport.sentimentScoreAverage} (${generalReport.sentimentScoreAverage < 0 ? "negative" : "positive or neutral"} tone)\n`;
  prompt += `- Number of Analyses Conducted: ${generalReport.analysisCount}\n\n`;

  prompt += `Detailed Analysis Findings:\n`;
  detailedAnalysis.forEach((issue, index) => {
    prompt += `${index + 1}. ${issue.aspect}: ${issue.feedback}\n`;
  });

  prompt += `\nExamples from the conversation:\n`;
  userMessages.forEach((msg, index) => {
    prompt += `${index + 1}. "${msg.text}"\n`;
  });

  prompt += `\nBased on the above analysis and examples, please provide specific, actionable recommendations. Aim to help the user improve their conversation skills in a clear and motivational manner, focusing on their strengths and areas for improvement. Conclude with positive reinforcement that encourages persistence and confidence in their writing journey.`;

  return prompt;
};
