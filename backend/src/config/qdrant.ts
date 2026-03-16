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
    const existing = collections.collections.find((c) => c.name === COLLECTION_NAME);

    if (existing) {
      const collectionInfo = await qdrantClient.getCollection(COLLECTION_NAME);
      const currentSize = (collectionInfo.config?.params?.vectors as { size?: number })?.size;

      if (currentSize && currentSize !== VECTOR_SIZE) {
        console.log(`⚠️ Qdrant collection has wrong vector size (${currentSize} vs ${VECTOR_SIZE}), recreating...`);
        await qdrantClient.deleteCollection(COLLECTION_NAME);
      } else {
        console.log(`✅ Qdrant collection '${COLLECTION_NAME}' already exists`);
        return;
      }
    }

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

    console.log(`✅ Qdrant collection '${COLLECTION_NAME}' created with ${VECTOR_SIZE}-dim vectors`);
  } catch (error) {
    console.error('❌ Failed to initialize Qdrant collection:', error);
    throw error;
  }
}
