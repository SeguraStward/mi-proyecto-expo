/**
 * ============================================================================
 * dark.ts — Tema Dark completo "Retro Forest Night"
 * ============================================================================
 *
 * Propósito:
 *   Ensambla el tema oscuro combinando todos los tokens modulares
 *   (colors, typography, spacing, borders). Se exporta listo para usar.
 *
 * @see src/theme/index.ts — Punto de entrada unificado
 * ============================================================================
 */

import { sharedBorderWidths, sharedRadius } from './borders';
import { darkColors } from './colors';
import { sharedTypography } from './fonts';
import { sharedSpacing } from './spacing';
import type { AppTheme } from './types';

export const darkTheme: AppTheme = {
  mode: 'dark',
  colors: darkColors,
  typography: sharedTypography,
  spacing: sharedSpacing,
  radius: sharedRadius,
  borderWidths: sharedBorderWidths,
  elevation: {
    none: {
      shadowColor: darkColors.shadow,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    sm: {
      shadowColor: darkColors.shadow,
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 2,
    },
    md: {
      shadowColor: darkColors.shadow,
      shadowOffset: { width: 3, height: 3 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 4,
    },
    lg: {
      shadowColor: darkColors.shadow,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 8,
    },
  },
};
