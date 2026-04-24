export interface AICareInfo {
  water: string;
  light: string;
  soil: string;
}

export interface PlantIdentificationResponse {
  isPlant: boolean;
  commonName: string;
  scientificName: string;
  confidence: number; // 0 a 1
  family?: string;
  toxicity?: string;
  care?: AICareInfo;
}
