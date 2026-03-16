import { getGenAI, isGeminiEnabled, SYSTEM_PROMPT } from '../config/gemini.js';
import { generateEmbedding } from './embeddingService.js';
import { searchVectors } from './qdrantService.js';
import { prisma } from '../config/database.js';

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

  let searchResults: any[] = [];
  let context = '';

  if (queryVector) {
    searchResults = await searchVectors(queryVector, 5, branchFilter);

    if (searchResults.length > 0) {
      context = searchResults
        .map(
          (result, index) =>
            `[Document ${index + 1}]
Title: ${result.payload.title || 'Untitled'}
Branch: ${result.payload.branchSlug}
Content: ${result.payload.text}
---`
        )
        .join('\n\n');
    }
  }

  if (!context) {
    const items = await prisma.archiveItem.findMany({
      where: {
        extractedText: { not: '' },
        ...(branchFilter && {
          collection: {
            branch: { slug: branchFilter },
          },
        }),
      },
      include: {
        collection: {
          include: { branch: true },
        },
      },
      take: 5,
    });

    if (items.length > 0) {
      context = items
        .map(
          (item, index) =>
            `[Document ${index + 1}]
Title: ${item.title}
Branch: ${item.collection.branch.name}
Collection: ${item.collection.title}
Content: ${item.extractedText?.substring(0, 500) || 'No content available'}
---`
        )
        .join('\n\n');

      searchResults = items.map((item) => ({
        payload: {
          title: item.title,
          branchSlug: item.collection.branch.slug,
          collectionId: item.collection.id,
          text: item.extractedText?.substring(0, 200) || '',
          itemId: item.id,
        },
      }));
    }
  }

  if (!context) {
    return {
      answer:
        'I could not find any relevant information in the archives for your query. Please try rephrasing your question or searching in a different branch.',
      sources: [],
    };
  }

  const genAI = getGenAI();
  if (!isGeminiEnabled() || !genAI) {
    return {
      answer:
        'The AI assistant is currently unavailable. Please try again later or contact support.',
      sources: searchResults.map((result) => ({
        title: result.payload.title || 'Untitled Document',
        collection: result.payload.collectionId,
        branch: result.payload.branchSlug,
        excerpt: result.payload.text.substring(0, 200) + '...',
        itemId: result.payload.itemId,
      })),
    };
  }

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: SYSTEM_PROMPT,
  });

  const prompt = `Based on the following archival documents, please answer this question: "${query}"

ARCHIVAL CONTEXT:
${context}

Remember to cite specific documents when providing information.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const answerText = response.text();

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
  } catch (error) {
    console.error('Gemini API error:', (error as Error).message);
    return {
      answer:
        'I apologize, but I encountered an error while processing your request. Please try again.',
      sources: [],
    };
  }
}
