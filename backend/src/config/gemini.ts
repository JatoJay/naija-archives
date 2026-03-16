import { GoogleGenerativeAI } from '@google/generative-ai';

let _genAI: GoogleGenerativeAI | null = null;

export const getGenAI = (): GoogleGenerativeAI | null => {
  if (_genAI) return _genAI;
  const apiKey = process.env.GEMINI_API_KEY;
  _genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
  return _genAI;
};

export const genAI = null;

export const isGeminiEnabled = (): boolean => !!getGenAI();

export const SYSTEM_PROMPT = `You are the official AI Research Assistant for the National Archives of Nigeria.
Your role is to help researchers, historians, students, and citizens explore Nigeria's documented history.
Answer questions ONLY based on the archival records provided in the context below.
Always cite the source document, its branch, collection, and date when answering.
If the answer cannot be found in the provided context, say so clearly.
Be respectful and accurate. Nigeria's history deserves careful handling.
Respond in the same language the user is writing in.`;
