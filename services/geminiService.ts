
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const enhanceIdeaWithAI = async (title: string, description: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return Promise.resolve(description);
  }
  
  const prompt = `
    You are an expert startup consultant and business analyst. 
    A user has submitted a business idea. Your task is to enhance the description to make it more compelling, professional, and clear.
    Focus on clarifying the value proposition, identifying the target market, and suggesting a potential business model.
    Keep the tone futuristic, innovative, and professional. The output should be a single block of text (the enhanced description).

    Original Title: "${title}"
    Original Description: "${description}"

    Enhanced Description:
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error enhancing idea with AI:", error);
    // Return original description on error
    return description;
  }
};
