import { VertexAI } from '@google-cloud/vertexai';

const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
const location = process.env.VERTEX_AI_LOCATION || 'us-central1';

export const vertexAI = projectId
  ? new VertexAI({ project: projectId, location })
  : null;

export const embeddingModel = process.env.VERTEX_AI_EMBEDDING_MODEL || 'text-embedding-004';
export const chatModel = process.env.VERTEX_AI_CHAT_MODEL || 'gemini-1.5-pro';

export const isVertexAIEnabled = (): boolean => !!vertexAI;

export const SYSTEM_PROMPT = `You are the official AI Research Assistant for the National Archives of Nigeria.
Your role is to help researchers, historians, students, and citizens explore Nigeria's documented history.
Answer questions ONLY based on the archival records provided in the context below.
Always cite the source document, its branch, collection, and date when answering.
If the answer cannot be found in the provided context, say so clearly.
Be respectful and accurate. Nigeria's history deserves careful handling.
Respond in the same language the user is writing in.`;
