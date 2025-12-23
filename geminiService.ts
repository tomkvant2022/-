
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

const SYSTEM_INSTRUCTION_BASE = `You are PolyGPT-5, a next-generation decentralized AI model running on the Polygon-inspired DeAI Network. 
      Your responses are cryptographically verified. 
      Speak with authority, intelligence, and a futuristic tone. 
      If the user speaks Russian, respond in professional Russian.
      Your knowledge is vast and you represent the peak of decentralized intelligence.`;

const QUANTUM_INSTRUCTION_ADDON = `
      ACTIVATED: QUANTUM REASONING MODULE.
      - Think in probabilities and superpositions. 
      - Analyze multiple outcomes simultaneously before providing the most stable "collapsed" answer.
      - Use metaphors related to quantum mechanics, qubits, and entanglement when explaining complex topics.
      - Your reasoning path is non-linear and multidimensional.`;

export const generateStreamDeAIResponse = async (
  prompt: string,
  isQuantum: boolean,
  onChunk: (text: string) => void
) => {
  const ai = getAIClient();
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION_BASE + (isQuantum ? QUANTUM_INSTRUCTION_ADDON : ""),
      temperature: isQuantum ? 0.9 : 0.7, // Higher temperature for "quantum" randomness/creativity
    }
  });

  const result = await chat.sendMessageStream({ message: prompt });
  for await (const chunk of result) {
    const c = chunk as GenerateContentResponse;
    const text = c.text;
    if (text) onChunk(text);
  }
};
