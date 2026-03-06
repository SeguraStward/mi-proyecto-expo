/**
 * ============================================================================
 * designSystem.ts — Re-exportación de compatibilidad
 * ============================================================================
 *
 * Este archivo re-exporta todo desde ./index.ts para mantener compatibilidad
 * con imports existentes que usan '@/src/theme/designSystem'.
 *
 * Nuevo import recomendado:
 *   import { useAppTheme } from '@/src/theme';
 *
 * @deprecated Usar '@/src/theme' directamente.
 * ============================================================================
 */

export {
  darkColors, darkTheme, getAppTheme, lightColors, lightTheme, MONO_FONT, PIXEL_FONT, sharedBorderWidths, sharedRadius, sharedSpacing, sharedTypography, useAppTheme
} from './index';

export type {
  AppTheme, ThemeBorderWidths, ThemeColors, ThemeElevation, ThemeMode, ThemeRadius, ThemeShadow, ThemeSpacing, ThemeTypography
} from './index';

