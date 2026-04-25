import { PlantIdentificationResponse } from '../types';
import { extractAndValidateBase64, inferMimeTypeFromBase64 } from './imageBase64';

const GEMINI_MODEL = process.env.GEMINI_MODEL ?? 'gemini-1.5-flash';

interface GeminiRawResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

interface GeminiPlantResult {
  isPlant: boolean;
  commonName?: string;
  scientificName?: string;
  confidence?: number;
  family?: string;
  toxicity?: string;
  care?: {
    water?: string;
    light?: string;
    soil?: string;
  };
}

function clampConfidence(value: unknown): number {
  if (typeof value !== 'number' || Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

function cleanString(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.trim();
}

function tryParseJson(text: string): GeminiPlantResult | null {
  const direct = text.trim();
  try {
    return JSON.parse(direct) as GeminiPlantResult;
  } catch {
    // Intento alternativo por si viene en bloque markdown.
  }

  const fenced = direct.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)?.[1];
  if (!fenced) return null;

  try {
    return JSON.parse(fenced) as GeminiPlantResult;
  } catch {
    return null;
  }
}

function normalizeGeminiResult(data: GeminiPlantResult): PlantIdentificationResponse {
  const isPlant = Boolean(data.isPlant);
  const commonName = cleanString(data.commonName);
  const scientificName = cleanString(data.scientificName);
  const family = cleanString(data.family) || undefined;
  const toxicity = cleanString(data.toxicity) || undefined;
  const confidence = clampConfidence(data.confidence);

  if (!isPlant) {
    return {
      isPlant: false,
      commonName: '',
      scientificName: '',
      confidence,
    };
  }

  const care = data.care
    ? {
      water: cleanString(data.care.water),
      light: cleanString(data.care.light),
      soil: cleanString(data.care.soil),
    }
    : undefined;

  const hasCare = Boolean(care && (care.water || care.light || care.soil));

  return {
    isPlant: true,
    commonName: commonName || scientificName || 'Planta',
    scientificName: scientificName || commonName || 'Planta desconocida',
    confidence,
    family,
    toxicity,
    care: hasCare ? care : undefined,
  };
}

export async function identifyPlantWithGemini(
  imageBase64: string,
  apiKey: string
): Promise<PlantIdentificationResponse> {
  const parsed = extractAndValidateBase64(imageBase64);
  const mimeType = parsed.mimeType ?? inferMimeTypeFromBase64(parsed.payload) ?? 'image/jpeg';
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const prompt = [
    'Analiza la imagen y responde SOLO JSON valido (sin markdown) con esta estructura exacta:',
    '{',
    '  "isPlant": boolean,',
    '  "commonName": string,',
    '  "scientificName": string,',
    '  "confidence": number,',
    '  "family": string,',
    '  "toxicity": string,',
    '  "care": { "water": string, "light": string, "soil": string }',
    '}',
    'Reglas:',
    '- confidence entre 0 y 1.',
    '- Si no es una planta: isPlant=false y deja strings vacios.',
    '- Responde en espanol para commonName/toxicity/care.',
  ].join('\n');

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType,
                data: parsed.payload,
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Gemini error ${response.status}: ${text}`);
  }

  const raw = (await response.json()) as GeminiRawResponse;
  const text = raw.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('Gemini error 502: Respuesta vacia del modelo');
  }

  const parsedResult = tryParseJson(text);
  if (!parsedResult) {
    throw new Error(`Gemini error 502: JSON invalido recibido: ${text}`);
  }

  return normalizeGeminiResult(parsedResult);
}
