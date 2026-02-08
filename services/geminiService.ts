import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || ''; // Ensure this is set in your environment
const ai = new GoogleGenAI({ apiKey });

export const generateProjectSynopsis = async (projectTitle: string, department: string): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Please configure the environment.";
  }

  try {
    const prompt = `
      Act as a senior academic professor. Write a detailed "Project Synopsis" for a final year engineering project titled "${projectTitle}" for the ${department} department.
      
      The synopsis must be structured into exactly these three sections with clear headings:
      
      1. **Introduction**: Introduce the domain, the specific problem being addressed, and the relevance of the project in the current technological landscape.
      2. **Proposed System**: Detail the technical methodology, algorithms, or hardware components used. Explain how the solution works.
      3. **Conclusion**: Summarize the results, advantages of the system, and potential future enhancements.
      
      Ensure the tone is formal, academic, and suitable for a 3-page project report documentation.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Failed to generate synopsis.";
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
