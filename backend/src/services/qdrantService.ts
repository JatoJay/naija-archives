import { v4 as uuidv4 } from 'uuid';
import { qdrantClient, COLLECTION_NAME, isQdrantEnabled } from '../config/qdrant.js';

interface VectorPayload {
  itemId: string;
  branchSlug: string;
  collectionId: string;
  chunkIndex: number;
  text: string;
  mediaType: string;
  title?: string;
}

interface SearchResult {
  id: string;
  score: number;
  payload: VectorPayload;
}

export async function upsertVectors(
  vectors: number[][],
  payloads: VectorPayload[]
): Promise<string[]> {
  if (!isQdrantEnabled() || !qdrantClient) {
    console.warn('Qdrant not enabled - skipping vector upsert');
    return [];
  }

  const pointIds: string[] = [];

  const points = vectors.map((vector, index) => {
    const id = uuidv4();
    pointIds.push(id);
    return {
      id,
      vector,
      payload: payloads[index],
    };
  });

  await qdrantClient.upsert(COLLECTION_NAME, {
    wait: true,
    points,
  });

  return pointIds;
}

export async function searchVectors(
  queryVector: number[],
  limit = 5,
  branchFilter?: string
): Promise<SearchResult[]> {
  if (!isQdrantEnabled() || !qdrantClient) {
    console.warn('Qdrant not enabled - returning empty search results');
    return [];
  }

  const filter = branchFilter
    ? {
        must: [
          {
            key: 'branchSlug',
            match: { value: branchFilter },
          },
        ],
      }
    : undefined;

  const results = await qdrantClient.search(COLLECTION_NAME, {
    vector: queryVector,
    limit,
    filter,
    with_payload: true,
  });

  return results.map((result) => ({
    id: result.id as string,
    score: result.score,
    payload: result.payload as unknown as VectorPayload,
  }));
}

export async function deleteVectorsByItemId(itemId: string): Promise<void> {
  if (!isQdrantEnabled() || !qdrantClient) {
    return;
  }

  await qdrantClient.delete(COLLECTION_NAME, {
    filter: {
      must: [
        {
          key: 'itemId',
          match: { value: itemId },
        },
      ],
    },
  });
}

export async function getCollectionInfo(): Promise<{
  vectorsCount: number;
  pointsCount: number;
} | null> {
  if (!isQdrantEnabled() || !qdrantClient) {
    return null;
  }

  const info = await qdrantClient.getCollection(COLLECTION_NAME);
  return {
    vectorsCount: info.vectors_count ?? 0,
    pointsCount: info.points_count ?? 0,
  };
}
