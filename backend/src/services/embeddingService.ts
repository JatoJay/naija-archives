import { vertexAI, embeddingModel, isVertexAIEnabled } from '../config/vertexai.js';

export async function generateEmbedding(text: string): Promise<number[] | null> {
  if (!isVertexAIEnabled() || !vertexAI) {
    console.warn('Vertex AI not enabled - skipping embedding generation');
    return null;
  }

  try {
    const model = vertexAI.getGenerativeModel({ model: embeddingModel });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text }] }],
    });

    const embedding = result.response.candidates?.[0]?.content?.parts?.[0];

    if (embedding && 'embedding' in embedding) {
      return embedding.embedding as number[];
    }

    throw new Error('No embedding in response');
  } catch (error) {
    console.error('Embedding generation error:', error);
    throw error;
  }
}

export async function generateEmbeddings(texts: string[]): Promise<(number[] | null)[]> {
  const embeddings: (number[] | null)[] = [];

  for (const text of texts) {
    const embedding = await generateEmbedding(text);
    embeddings.push(embedding);
  }

  return embeddings;
}
