import { PlantIdentificationResponse } from '../types';

const PLANT_ID_BASE_URL =
  process.env.PLANT_ID_BASE_URL ?? 'https://plant.id/api/v3';

const DETAIL_FIELDS = [
  'common_names',
  'taxonomy',
  'best_light_condition',
  'best_soil_type',
  'toxicity',
].join(',');

interface PlantIdSuggestionDetails {
  common_names?: string[];
  taxonomy?: { family?: string };
  watering?: { min?: number; max?: number };
  best_light_condition?: string | { value?: string };
  best_soil_type?: string | { value?: string };
  toxicity?: string | { value?: string };
}

interface PlantIdSuggestion {
  name: string;
  probability: number;
  details?: PlantIdSuggestionDetails;
}

interface PlantIdRawResponse {
  result?: {
    is_plant?: { probability: number; binary?: boolean };
    classification?: { suggestions?: PlantIdSuggestion[] };
  };
}

function readString(v: unknown): string | undefined {
  if (typeof v === 'string') return v;
  if (v && typeof v === 'object' && 'value' in (v as Record<string, unknown>)) {
    const value = (v as Record<string, unknown>).value;
    if (typeof value === 'string') return value;
  }
  return undefined;
}

function wateringToText(
  w: PlantIdSuggestionDetails['watering']
): string | undefined {
  if (!w) return undefined;
  const scale = ['Muy poca', 'Poca', 'Moderada', 'Abundante', 'Muy abundante'];
  const min = typeof w.min === 'number' ? scale[w.min - 1] : undefined;
  const max = typeof w.max === 'number' ? scale[w.max - 1] : undefined;
  if (min && max && min !== max) return `${min} a ${max}`;
  return min ?? max;
}

function buildCare(details?: PlantIdSuggestionDetails) {
  if (!details) return undefined;
  const water = wateringToText(details.watering) ?? '';
  const light = readString(details.best_light_condition) ?? '';
  const soil = readString(details.best_soil_type) ?? '';
  if (!water && !light && !soil) return undefined;
  return { water, light, soil };
}

interface ParsedBase64Image {
  payload: string;
  mimeType?: string;
}

function inferMimeTypeFromBase64(payload: string): string | undefined {
  if (payload.startsWith('/9j/')) return 'image/jpeg';
  if (payload.startsWith('iVBORw0KGgo')) return 'image/png';
  if (payload.startsWith('UklGR')) return 'image/webp';
  if (payload.startsWith('R0lGOD')) return 'image/gif';
  return undefined;
}

function extractAndValidateBase64(imageBase64: string): ParsedBase64Image {
  const clean = imageBase64.replace(/\s/g, '').trim();

  let payload = clean;
  let mimeType: string | undefined;

  if (clean.startsWith('data:')) {
    const match = clean.match(/^data:([^;,]+);base64,(.+)$/i);
    if (!match) {
      throw new Error('Imagen invalida: data URI mal formado');
    }
    mimeType = match[1];
    payload = match[2];
  }

  if (!payload || payload.length < 128) {
    throw new Error('Imagen invalida: base64 vacio o incompleto');
  }

  if (!/^[A-Za-z0-9+/=]+$/.test(payload)) {
    throw new Error('Imagen invalida: base64 con caracteres no permitidos');
  }

  return { payload, mimeType };
}

function buildImageCandidates(parsed: ParsedBase64Image): string[] {
  const mimeType = parsed.mimeType ?? inferMimeTypeFromBase64(parsed.payload) ?? 'image/jpeg';
  const dataUri = `data:${mimeType};base64,${parsed.payload}`;

  // Probamos ambos formatos por compatibilidad entre variantes de captura.
  return Array.from(new Set([dataUri, parsed.payload]));
}

async function requestPlantId(
  url: string,
  apiKey: string,
  image: string
): Promise<Response> {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Api-Key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      images: [image],
    }),
  });
}

export async function identifyPlantWithPlantId(
  imageBase64: string,
  apiKey: string
): Promise<PlantIdentificationResponse> {
  const richUrl = `${PLANT_ID_BASE_URL}/identification?details=${encodeURIComponent(
    DETAIL_FIELDS
  )}&language=es`;
  const basicUrl = `${PLANT_ID_BASE_URL}/identification?language=es`;

  const parsedImage = extractAndValidateBase64(imageBase64);
  const imageCandidates = buildImageCandidates(parsedImage);

  let response: Response | null = null;
  let lastError = 'Error desconocido';

  for (const url of [richUrl, basicUrl]) {
    for (const image of imageCandidates) {
      response = await requestPlantId(url, apiKey, image);
      if (response.ok) {
        break;
      }

      const text = await response.text().catch(() => '');
      lastError = `Plant.id error ${response.status}: ${text}`;

      const looksLikeInvalidImage =
        response.status === 400 &&
        /invalid image data|invalid base64 image data/i.test(text);

      if (!looksLikeInvalidImage) {
        throw new Error(lastError);
      }
    }

    if (response?.ok) {
      break;
    }
  }

  if (!response || !response.ok) {
    throw new Error(lastError);
  }

  const data = (await response.json()) as PlantIdRawResponse;
  const isPlant = Boolean(data.result?.is_plant?.binary ?? data.result?.is_plant?.probability);
  const top = data.result?.classification?.suggestions?.[0];

  if (!top || !isPlant) {
    return {
      isPlant: false,
      commonName: '',
      scientificName: '',
      confidence: data.result?.is_plant?.probability ?? 0,
    };
  }

  const commonName = top.details?.common_names?.[0] ?? top.name;

  return {
    isPlant: true,
    commonName,
    scientificName: top.name,
    confidence: top.probability,
    family: top.details?.taxonomy?.family,
    toxicity: readString(top.details?.toxicity),
    care: buildCare(top.details),
  };
}
