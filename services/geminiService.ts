import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || ''; // Ensure this is set in your environment
const ai = new GoogleGenAI({ apiKey });

export const generateProjectAbstract = async (projectTitle: string, department: string): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Please configure the environment.";
  }

  try {
    const prompt = `
      Act as a senior academic professor. Write a professional, academic abstract (approx 150 words) for a final year engineering project titled "${projectTitle}" for the ${department} department. 
      Focus on the problem statement, the methodology used, and the expected outcome. 
      Use formal technical language suitable for a Viva-Voce report.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Failed to generate abstract.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "An error occurred while generating the content. Please try again later.";
  }
};

export const generateVivaQuestions = async (projectTitle: string): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing.";
  }
  
  try {
    const prompt = `
      Generate 5 likely Viva-Voce technical questions and brief answers for the engineering project: "${projectTitle}".
      Format the output as a clean Markdown list.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Failed to generate questions.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "An error occurred while generating questions.";
  }
}
