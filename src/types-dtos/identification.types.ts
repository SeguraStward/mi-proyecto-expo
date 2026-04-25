/**
 * Tipos del flujo de identificacion de plantas con IA (Plant.id via backend).
 */

export interface AICareInfo {
  water: string;
  light: string;
  soil: string;
}

export interface PlantIdentificationResult {
  isPlant: boolean;
  commonName: string;
  scientificName: string;
  confidence: number; // 0 a 1
  description?: string;
  family?: string;
  toxicity?: string;
  care?: AICareInfo;
  photoUri: string;
}

export interface IdentifyRequest {
  imageBase64: string;
}
