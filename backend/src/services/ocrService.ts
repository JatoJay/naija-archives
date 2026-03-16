import vision from '@google-cloud/vision';

const client = new vision.ImageAnnotatorClient();

export async function extractTextFromImage(imageBuffer: Buffer): Promise<string> {
  try {
    const [result] = await client.textDetection({
      image: { content: imageBuffer.toString('base64') },
    });

    const detections = result.textAnnotations;

    if (detections && detections.length > 0) {
      return detections[0]?.description || '';
    }

    return '';
  } catch (error) {
    console.error('OCR extraction error:', error);
    throw error;
  }
}

export async function extractTextFromImageUrl(imageUrl: string): Promise<string> {
  try {
    const [result] = await client.textDetection(imageUrl);

    const detections = result.textAnnotations;

    if (detections && detections.length > 0) {
      return detections[0]?.description || '';
    }

    return '';
  } catch (error) {
    console.error('OCR extraction error:', error);
    throw error;
  }
}

export async function detectDocumentText(imageBuffer: Buffer): Promise<string> {
  try {
    const [result] = await client.documentTextDetection({
      image: { content: imageBuffer.toString('base64') },
    });

    const fullTextAnnotation = result.fullTextAnnotation;
    return fullTextAnnotation?.text || '';
  } catch (error) {
    console.error('Document OCR error:', error);
    throw error;
  }
}
