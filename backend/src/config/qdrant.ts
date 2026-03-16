import { QdrantClient } from '@qdrant/js-client-rest';

const qdrantUrl = process.env.QDRANT_URL;
const qdrantApiKey = process.env.QDRANT_API_KEY;

export const qdrantClient = qdrantUrl
  ? new QdrantClient({ url: qdrantUrl, apiKey: qdrantApiKey || undefined })
  : null;

export const COLLECTION_NAME = 'nigeria_archives';
export const VECTOR_SIZE = 768;

export const isQdrantEnabled = (): boolean => !!qdrantClient;

export async function initializeQdrantCollection(): Promise<void> {
  if (!qdrantClient) {
    console.log('⚠️ Qdrant not configured - vector search disabled');
    return;
  }
  try {
    const collections = await qdrantClient.getCollections();
    const exists = collections.collections.some((c) => c.name === COLLECTION_NAME);

    if (!exists) {
      await qdrantClient.createCollection(COLLECTION_NAME, {
        vectors: {
          size: VECTOR_SIZE,
          distance: 'Cosine',
        },
      });

      await qdrantClient.createPayloadIndex(COLLECTION_NAME, {
        field_name: 'branchSlug',
        field_schema: 'keyword',
      });

      await qdrantClient.createPayloadIndex(COLLECTION_NAME, {
        field_name: 'collectionId',
        field_schema: 'keyword',
      });

      await qdrantClient.createPayloadIndex(COLLECTION_NAME, {
        field_name: 'mediaType',
        field_schema: 'keyword',
      });

      console.log(`✅ Qdrant collection '${COLLECTION_NAME}' created`);
    } else {
      console.log(`✅ Qdrant collection '${COLLECTION_NAME}' already exists`);
    }
  } catch (error) {
    console.error('❌ Failed to initialize Qdrant collection:', error);
    throw error;
  }
}
