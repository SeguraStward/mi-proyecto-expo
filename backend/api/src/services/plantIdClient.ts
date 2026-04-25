import { PlantIdentificationResponse } from '../types';

const PLANT_ID_BASE_URL =
  process.env.PLANT_ID_BASE_URL ?? 'https://plant.id/api/v3';

const DETAIL_FIELDS = [
  'common_names',
  'taxonomy',
  'watering',
  'sunlight',
  'soil',
  'best_light_condition',
  'best_soil_type',
  'toxicity',
  'description',
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

export async function identifyPlantWithPlantId(
  imageBase64: string,
  apiKey: string
): Promise<PlantIdentificationResponse> {
  const url = `${PLANT_ID_BASE_URL}/identification?details=${encodeURIComponent(
    DETAIL_FIELDS
  )}&language=es`;

  // Plant.id v3 requiere el prefijo data URI y sin saltos de linea
  const clean = imageBase64.replace(/\s/g, '');
  const image = clean.startsWith('data:')
    ? clean
    : `data:image/jpeg;base64,${clean}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Api-Key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      images: [image],
      similar_images: false,
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Plant.id error ${response.status}: ${text}`);
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
