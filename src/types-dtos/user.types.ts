/**
 * Tipos y DTOs del usuario — alineados con el schema de Firestore.
 */

export interface UserProfile {
  bio: string;
  avatarUrl: string;
}

export interface UserContactInfo {
  instagram: string;
  whatsapp: string;
}

export interface UserLocation {
  country: string;
  province: string;
}

export interface UserGamification {
  level: number;
  levelName: string;
  currentXP: number;
  totalXP: number;
  nextLevelXP: number;
  dailyStreak: number;
  badges: string[];
}

export interface UserSocial {
  enraizados: string[];
}

export interface UserDocument {
  id: string;
  username: string;
  displayName: string;
  profile: UserProfile;
  contactInfo: UserContactInfo;
  location: UserLocation;
  gamification: UserGamification;
  social: UserSocial;
  createdAt: string;
  updatedAt: string;
}

/** DTO para actualizacion parcial del perfil (solo campos editables). */
export type UpdateUserDTO = Partial<
  Pick<UserDocument, 'displayName' | 'profile' | 'contactInfo' | 'location'>
>;

/**
 * @deprecated Usar UserDocument en su lugar. Mantenido para compatibilidad temporal.
 */
export interface UserInterface {
  nombre: string;
  apodo: string;
  cantidadPlantas: number;
  categorias: string[];
  racha: number;
  cumple: string;
  imagen: string;
  amigos: number;
  privacidad: boolean;
  descripcion: string;
  plantaFavorita: string;
}
