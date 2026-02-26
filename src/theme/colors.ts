/**
 * Colores del tema (re-exporta la paleta principal con tokens semánticos).
 */
import { PlantColors } from '@/src/constants/colors';

export const ThemeColors = {
  ...PlantColors,

  // ── Tokens semánticos de tema ───────────────────────
  brandPrimary: PlantColors.primary,
  brandSecondary: PlantColors.primaryLight,
  accent: PlantColors.primarySoft,

  backgroundPrimary: PlantColors.background,
  backgroundSecondary: PlantColors.surface,

  textDefault: PlantColors.textPrimary,
  textSubtle: PlantColors.textSecondary,
  textDisabled: PlantColors.textMuted,
} as const;
