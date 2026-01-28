import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY;
// Using the recommended fast image model
const MODEL_NAME = 'gemini-2.5-flash-image';

export const processImageWithGemini = async (base64Image: string): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Clean the base64 string if it contains metadata headers
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanBase64,
            },
          },
          {
            text: "Extract the person from this image and place them on a pure solid black background (#000000). Keep the facial expression exactly the same. High contrast, clean edges. Return ONLY the image.",
          },
        ],
      },
    });

    // Iterate through parts to find the image
    const parts = response.candidates?.[0]?.content?.parts;
    
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
           return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("No image data returned from Gemini.");

  } catch (error) {
    console.error("Gemini processing error:", error);
    throw error;
  }
};
