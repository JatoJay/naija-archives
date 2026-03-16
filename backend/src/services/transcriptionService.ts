import speech from '@google-cloud/speech';

const client = new speech.SpeechClient();

interface TranscriptionResult {
  transcript: string;
  confidence: number;
}

export async function transcribeAudio(
  audioBuffer: Buffer,
  encoding: 'MP3' | 'FLAC' | 'LINEAR16' | 'OGG_OPUS' = 'MP3',
  sampleRateHertz = 16000,
  languageCode = 'en-US'
): Promise<TranscriptionResult> {
  try {
    const audio = {
      content: audioBuffer.toString('base64'),
    };

    const config = {
      encoding: encoding as unknown as number,
      sampleRateHertz,
      languageCode,
      enableAutomaticPunctuation: true,
      model: 'latest_long',
    };

    const [response] = await client.recognize({ audio, config });

    const transcription = response.results
      ?.map((result) => result.alternatives?.[0]?.transcript || '')
      .join('\n');

    const confidence =
      response.results?.[0]?.alternatives?.[0]?.confidence || 0;

    return {
      transcript: transcription || '',
      confidence,
    };
  } catch (error) {
    console.error('Transcription error:', error);
    throw error;
  }
}

export async function transcribeFromGcsUri(
  gcsUri: string,
  languageCode = 'en-US'
): Promise<TranscriptionResult> {
  try {
    const audio = { uri: gcsUri };

    const config = {
      encoding: 'MP3' as unknown as number,
      sampleRateHertz: 16000,
      languageCode,
      enableAutomaticPunctuation: true,
      model: 'latest_long',
    };

    const [operation] = await client.longRunningRecognize({ audio, config });
    const [response] = await operation.promise();

    const transcription = response.results
      ?.map((result) => result.alternatives?.[0]?.transcript || '')
      .join('\n');

    const confidence =
      response.results?.[0]?.alternatives?.[0]?.confidence || 0;

    return {
      transcript: transcription || '',
      confidence,
    };
  } catch (error) {
    console.error('Long-running transcription error:', error);
    throw error;
  }
}
