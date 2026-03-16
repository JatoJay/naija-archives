import { vertexAI, chatModel, SYSTEM_PROMPT } from '../config/vertexai.js';
import { generateEmbedding } from './embeddingService.js';
import { searchVectors } from './qdrantService.js';

interface Source {
  title: string;
  collection: string;
  branch: string;
  excerpt: string;
  itemId: string;
}

interface ChatResponse {
  answer: string;
  sources: Source[];
}

export async function generateRAGResponse(
  query: string,
  branchFilter?: string
): Promise<ChatResponse> {
  const queryVector = await generateEmbedding(query);

  const searchResults = await searchVectors(queryVector, 5, branchFilter);

  if (searchResults.length === 0) {
    return {
      answer:
        'I could not find any relevant information in the archives for your query. Please try rephrasing your question or searching in a different branch.',
      sources: [],
    };
  }

  const context = searchResults
    .map(
      (result, index) =>
        `[Document ${index + 1}]
Title: ${result.payload.title || 'Untitled'}
Branch: ${result.payload.branchSlug}
Content: ${result.payload.text}
---`
    )
    .join('\n\n');

  const model = vertexAI.getGenerativeModel({
    model: chatModel,
    systemInstruction: SYSTEM_PROMPT,
  });

  const prompt = `Based on the following archival documents, please answer this question: "${query}"

ARCHIVAL CONTEXT:
${context}

Remember to cite specific documents when providing information.`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const answer = response.candidates?.[0]?.content?.parts?.[0];

  const answerText =
    answer && 'text' in answer
      ? answer.text
      : 'I apologize, but I could not generate a response at this time.';

  const sources: Source[] = searchResults.map((result) => ({
    title: result.payload.title || 'Untitled Document',
    collection: result.payload.collectionId,
    branch: result.payload.branchSlug,
    excerpt: result.payload.text.substring(0, 200) + '...',
    itemId: result.payload.itemId,
  }));

  return {
    answer: answerText,
    sources,
  };
}
