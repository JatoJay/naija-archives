import api from './api';
import type { ChatResponse, ChatMessage } from '@/types';

interface ChatRequest {
  query: string;
  sessionId?: string;
  branchFilter?: string;
}

export async function sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
  const response = await api.post<ChatResponse>('/ai/chat', request);
  return response.data;
}

export async function getChatHistory(
  sessionId: string
): Promise<{ id: string; messages: ChatMessage[] }> {
  const response = await api.get<{ id: string; messages: ChatMessage[] }>(
    `/ai/history/${sessionId}`
  );
  return response.data;
}

export async function clearChatHistory(sessionId: string): Promise<void> {
  await api.delete(`/ai/history/${sessionId}`);
}
