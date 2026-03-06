/**
 * ============================================================================
 * light.ts — Tema Light completo "Retro Forest Day"
 * ============================================================================
 *
 * Propósito:
 *   Ensambla el tema claro combinando todos los tokens modulares
 *   (colors, typography, spacing, borders). Se exporta listo para usar.
 *
 * @see src/theme/index.ts — Punto de entrada unificado
 * ============================================================================
 */

import { sharedBorderWidths, sharedRadius } from './borders';
import { lightColors } from './colors';
import { sharedTypography } from './fonts';
import { sharedSpacing } from './spacing';
import type { AppTheme } from './types';

export const lightTheme: AppTheme = {
  mode: 'light',
  colors: lightColors,
  typography: sharedTypography,
  spacing: sharedSpacing,
  radius: sharedRadius,
  borderWidths: sharedBorderWidths,
  elevation: {
    none: {
      shadowColor: lightColors.shadow,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    sm: {
      shadowColor: lightColors.shadow,
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 0,   // 0 blur = sombra sólida pixel art
      elevation: 2,
    },
    md: {
      shadowColor: lightColors.shadow,
      shadowOffset: { width: 3, height: 3 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 4,
    },
    lg: {
      shadowColor: lightColors.shadow,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 8,
    },
  },
};
