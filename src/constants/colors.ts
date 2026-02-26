/**
 * Paleta de colores "Plant-focused"
 * Tonos verdes, blancos y texturas suaves — estilo minimalista.
 */

export const PlantColors = {
  // ── Primarios ──────────────────────────────────────────────
  primary: '#2D6A4F', // verde oscuro (CTA, acentos)
  primaryLight: '#52B788', // verde medio
  primarySoft: '#95D5B2', // verde suave
  primaryPale: '#D8F3DC', // verde pálido (fondos de cards)

  // ── Neutros ────────────────────────────────────────────────
  white: '#FFFFFF',
  background: '#F8FBF8', // blanco con un sutil toque verde
  surface: '#FFFFFF',
  border: '#E8F0E8',
  divider: '#E0E8E0',

  // ── Texto ──────────────────────────────────────────────────
  textPrimary: '#1B4332',
  textSecondary: '#52796F',
  textMuted: '#8DA89B',
  textOnPrimary: '#FFFFFF',

  // ── Estado / utilidad ──────────────────────────────────────
  success: '#40916C',
  warning: '#E9C46A',
  error: '#E76F51',
  info: '#457B9D',

  // ── Categorías de plantas (chips) ─────────────────────────
  chipBackground: '#EAF4E6',
  chipText: '#2D6A4F',
  chipBorder: '#C8E6C9',

  // ── Sombra ─────────────────────────────────────────────────
  shadow: '#1B433220', // 12 % opacidad
} as const;

export type PlantColorKey = keyof typeof PlantColors;
