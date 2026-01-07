import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function generateWithGemini(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  try {
    const result = await model.generateContent({
        contents: [
            { role: 'user', parts: [{ text: systemPrompt + "\n\n" + userPrompt }] }
        ],
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4096,
        }
    });

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error('An unknown error occurred with Gemini API');
  }
}
