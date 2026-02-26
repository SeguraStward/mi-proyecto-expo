/**
 * Tipos y DTOs del usuario.
 */
export interface UserInterface {
  /** Nombre completo */
  nombre: string;
  /** Apodo / nombre de usuario */
  apodo: string;
  /** Cantidad total de plantas */
  cantidadPlantas: number;
  /** Categorías de plantas que posee (ej. "Suculentas", "Tropicales") */
  categorias: string[];
  /** Racha de días consecutivos de riego */
  racha: number;
  /** Fecha de cumpleaños (ISO 8601) */
  cumple: string;
  /** URI de la imagen de perfil */
  imagen: string;
  /** Número de amigos */
  amigos: number;
  /** true = perfil privado */
  privacidad: boolean;
  /** Descripción / bio */
  descripcion: string;
  /** Nombre de la planta favorita */
  plantaFavorita: string;
}

/** DTO para actualización parcial del perfil */
export type UpdateUserDTO = Partial<Omit<UserInterface, 'apodo'>>;
