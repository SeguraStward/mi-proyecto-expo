/**
 * Tipos y DTOs de plantas — alineados con el schema de Firestore.
 */

export interface PlantPhoto {
  url: string;
  isPrimary: boolean;
  caption: string;
  takenAt: string;
}

export interface BotanicalInfo {
  commonName: string;
  scientificName: string;
  family: string;
  origin: string;
  climate: string;
  toxicity: string;
  maxHeight: string;
  growthRate: string;
}

export interface CareRules {
  wateringFrequencyDays: number;
  sunlight: string;
  humidity: string;
  fertilizerFrequencyDays: number;
  soilType: string;
  pruningSeason: string;
  rotationFrequencyDays: number;
}

export interface PlantStatus {
  ageInMonths: number;
  currentHeightCm: number;
  potSizeCm: number;
  health: string;
  careStreak: number;
  waterLevel: number;
  lastWateredAt: string;
  nextWateringDue: string;
}

export interface PlantDocument {
  id: string;
  userId: string;
  nickname: string;
  photos: PlantPhoto[];
  botanicalInfo: BotanicalInfo;
  careRules: CareRules;
  status: PlantStatus;
  createdAt: string;
  updatedAt: string;
}

/** DTO para actualizacion parcial de una planta (solo campos editables). */
export type UpdatePlantDTO = Partial<
  Pick<PlantDocument, 'nickname' | 'careRules' | 'status'>
>;
