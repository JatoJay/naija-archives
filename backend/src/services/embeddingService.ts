import { PredictionServiceClient, helpers } from '@google-cloud/aiplatform';

const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
const location = process.env.VERTEX_AI_LOCATION || 'us-central1';
const TEXT_EMBEDDING_MODEL = 'text-embedding-005';
const MULTIMODAL_MODEL = 'multimodalembedding@001';

let predictionClient: PredictionServiceClient | null = null;

function getClient(): PredictionServiceClient {
  if (!predictionClient) {
    predictionClient = new PredictionServiceClient({
      apiEndpoint: `${location}-aiplatform.googleapis.com`,
    });
  }
  return predictionClient;
}

function getEndpoint(modelId: string): string {
  return `projects/${projectId}/locations/${location}/publishers/google/models/${modelId}`;
}

export async function generateEmbedding(text: string): Promise<number[] | null> {
  if (!projectId) {
    console.warn('GOOGLE_CLOUD_PROJECT_ID not set, embeddings disabled');
    return null;
  }

  try {
    const client = getClient();
    const instance = helpers.toValue({ content: text });
    const parameters = helpers.toValue({ outputDimensionality: 768 });
    const [response] = await client.predict({
      endpoint: getEndpoint(TEXT_EMBEDDING_MODEL),
      instances: [instance],
      parameters,
    });

    const embedding = response.predictions?.[0]?.structValue?.fields?.embeddings?.structValue?.fields?.values?.listValue?.values;
    if (embedding) {
      return embedding.map((v) => v.numberValue ?? 0);
    }
    return null;
  } catch (error) {
    console.warn('Text embedding generation failed:', (error as Error).message);
    return null;
  }
}

export async function generateImageEmbedding(imageBase64: string, mimeType: string = 'image/jpeg'): Promise<number[] | null> {
  if (!projectId) {
    return null;
  }

  try {
    const client = getClient();
    const instance = helpers.toValue({
      image: {
        bytesBase64Encoded: imageBase64,
      },
    });
    const [response] = await client.predict({
      endpoint: getEndpoint(MULTIMODAL_MODEL),
      instances: [instance],
    });

    const embedding = response.predictions?.[0]?.structValue?.fields?.imageEmbedding?.listValue?.values;
    if (embedding) {
      return embedding.map((v) => v.numberValue ?? 0);
    }
    return null;
  } catch (error) {
    console.warn('Image embedding generation failed:', (error as Error).message);
    return null;
  }
}

export async function generateVideoEmbedding(
  gcsUri: string,
  startOffsetSec: number = 0,
  endOffsetSec: number = 120
): Promise<number[] | null> {
  if (!projectId) {
    return null;
  }

  try {
    const client = getClient();
    const instance = helpers.toValue({
      video: {
        gcsUri,
        videoSegmentConfig: {
          startOffsetSec,
          endOffsetSec,
          intervalSec: 16,
        },
      },
    });
    const [response] = await client.predict({
      endpoint: getEndpoint(MULTIMODAL_MODEL),
      instances: [instance],
    });

    const embeddings = response.predictions?.[0]?.structValue?.fields?.videoEmbeddings?.listValue?.values;
    if (embeddings && embeddings.length > 0) {
      const firstSegment = embeddings[0]?.structValue?.fields?.embedding?.listValue?.values;
      if (firstSegment) {
        return firstSegment.map((v) => v.numberValue ?? 0);
      }
    }
    return null;
  } catch (error) {
    console.warn('Video embedding generation failed:', (error as Error).message);
    return null;
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
