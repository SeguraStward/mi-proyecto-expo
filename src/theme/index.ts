/**
 * ============================================================================
 * index.ts — Punto de entrada unificado del Retro Garden DS
 * ============================================================================
 *
 * Propósito:
 *   Re-exporta los tipos, tokens y constructores de tema desde los módulos
 *   individuales (colors, fonts, spacing, borders, light, dark).
 *
 *   Cualquier archivo del proyecto puede importar desde aquí:
 *     import { useAppTheme, AppTheme } from '@/src/theme';
 *
 * Arquitectura modular:
 *   colors.ts    → Paleta cromática (light + dark)
 *   fonts.ts     → Tipografía (Press Start 2P / Courier New)
 *   spacing.ts   → Escala de espaciado base-4
 *   borders.ts   → Radius + border widths pixel art
 *   light.ts     → Tema claro ensamblado
 *   dark.ts      → Tema oscuro ensamblado
 *   index.ts     → (este archivo) Punto unificado + hooks
 *
 * @see docs/DESIGN_SYSTEM_RETRO.md
 * ============================================================================
 */

import { ColorSchemeName } from 'react-native';

import { useThemeToggle } from '@/src/context/ThemeContext';

// ── Re-exportar tipos de cada módulo ──────────────────────────────────────────

export type { ThemeBorderWidths, ThemeRadius } from './borders';
export type { ThemeColors } from './colors';
export type { ThemeTypography } from './fonts';
export type { ThemeSpacing } from './spacing';

// ── Re-exportar valores de cada módulo ────────────────────────────────────────

export { sharedBorderWidths, sharedRadius } from './borders';
export { darkColors, lightColors } from './colors';
export { MONO_FONT, PIXEL_FONT, sharedTypography } from './fonts';
export { sharedSpacing } from './spacing';

// ── Tipos de elevación ────────────────────────────────────────────────────────

export type {
    AppTheme,
    ThemeElevation,
    ThemeMode,
    ThemeShadow
} from './types';

// ── Tipo del tema completo ────────────────────────────────────────────────────

import type { AppTheme, ThemeMode } from './types';

// ── Temas ensamblados ─────────────────────────────────────────────────────────

import { darkTheme } from './dark';
import { lightTheme } from './light';

export { darkTheme, lightTheme };

const themes: Record<ThemeMode, AppTheme> = {
  light: lightTheme,
  dark: darkTheme,
};

// ── Funciones de acceso ───────────────────────────────────────────────────────

/**
 * Obtiene el tema completo según el modo de color.
 * Útil fuera de componentes React (ej: funciones helper).
 */
export function getAppTheme(mode: ColorSchemeName): AppTheme {
  if (mode === 'dark') return themes.dark;
  return themes.light;
}

/**
 * Hook que retorna el tema activo según la preferencia del usuario.
 * Lee del ThemeContext (toggle manual) en lugar del sistema.
 * Uso: const theme = useAppTheme();
 */
export function useAppTheme(): AppTheme {
  const { mode } = useThemeToggle();
  return getAppTheme(mode);
}
