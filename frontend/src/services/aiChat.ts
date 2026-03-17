import api from './api';
import type { ChatResponse, ChatMessage } from '@/types';

interface ChatRequest {
  query: string;
  sessionId?: string;
  branchFilter?: string;
}

const DEMO_RESPONSES: Record<string, string> = {
  default: `I'm the Nigeria Archives AI Assistant. I can help you explore Nigeria's rich history through our digitized archives.

**Currently in Demo Mode**

The AI backend is not yet connected. Once deployed, I'll be able to:
- Search through historical documents
- Answer questions about Nigerian history
- Provide context from colonial records, independence documents, and more

For now, feel free to explore the collections and branches available on this portal.`,

  independence: `Nigeria gained independence from British colonial rule on October 1, 1960. This momentous occasion was marked by the lowering of the Union Jack and the raising of Nigeria's green-white-green flag.

**Note:** This is a demo response. Connect the backend to access actual archival documents about Nigeria's independence.`,

  colonial: `The colonial period in Nigeria spanned from 1861 (when Lagos was annexed) to 1960. During this time, the British administered Nigeria through various systems including indirect rule in the North.

**Note:** This is a demo response. Connect the backend to search our colonial-era document collections.`,
};

function getDemoResponse(query: string): string {
  const lowerQuery = query.toLowerCase();
  if (lowerQuery.includes('independence') || lowerQuery.includes('1960')) {
    return DEMO_RESPONSES.independence;
  }
  if (lowerQuery.includes('colonial') || lowerQuery.includes('british')) {
    return DEMO_RESPONSES.colonial;
  }
  return DEMO_RESPONSES.default;
}

export async function sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
  try {
    const response = await api.post<ChatResponse>('/ai/chat', request);
    return response.data;
  } catch {
    console.warn('AI API unavailable, using demo response');
    return {
      answer: getDemoResponse(request.query),
      sources: [],
      sessionId: 'demo-session',
    };
  }
}

export async function getChatHistory(
  sessionId: string
): Promise<{ id: string; messages: ChatMessage[] }> {
  try {
    const response = await api.get<{ id: string; messages: ChatMessage[] }>(
      `/ai/history/${sessionId}`
    );
    return response.data;
  } catch {
    return { id: sessionId, messages: [] };
  }
}

export async function clearChatHistory(sessionId: string): Promise<void> {
  try {
    await api.delete(`/ai/history/${sessionId}`);
  } catch {
    // Ignore errors in demo mode
  }
}
