/**
 * ============================================================================
 * types.ts — Tipos compartidos del Retro Garden DS
 * ============================================================================
 *
 * Propósito:
 *   Define los tipos de tema (AppTheme, ThemeMode, ThemeElevation, etc.)
 *   en un archivo separado para evitar dependencias circulares entre
 *   index.ts y light.ts/dark.ts.
 *
 * ============================================================================
 */

import type { ThemeBorderWidths, ThemeRadius } from './borders';
import type { ThemeColors } from './colors';
import type { ThemeTypography } from './fonts';
import type { ThemeSpacing } from './spacing';

export type ThemeMode = 'light' | 'dark';

export interface ThemeShadow {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

export interface ThemeElevation {
  none: ThemeShadow;
  sm: ThemeShadow;
  md: ThemeShadow;
  lg: ThemeShadow;
}

export interface AppTheme {
  mode: ThemeMode;
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  radius: ThemeRadius;
  borderWidths: ThemeBorderWidths;
  elevation: ThemeElevation;
}
