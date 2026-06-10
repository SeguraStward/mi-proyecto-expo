/**
 * ============================================================================
 * AppText — Componente de tipografía del Design System
 * ============================================================================
 *
 * Propósito:
 *   Componente de texto reutilizable que aplica automáticamente los presets
 *   tipográficos definidos en el Design System (hero, title, subtitle, body,
 *   bodySmall, caption, overline). Escala fluida: 24→20→16→15→14→13→11.
 *
 *   La fuente y el tamaño elegidos por el usuario se inyectan en el tema vía
 *   useAppTheme(), así que aquí se leen de theme.typography (familia + sizes
 *   ya escalados) y el componente reacciona automáticamente.
 *
 * Uso:
 *   <AppText preset="title">Mi Título</AppText>
 *   <AppText preset="caption" color={theme.colors.textMuted}>Fecha</AppText>
 *
 * @see docs/DESIGN_SYSTEM.md — Sección A.2 Tipografía
 * ============================================================================
 */

import { useAppTheme } from '@/src/theme/designSystem';
import React from 'react';
import { Text, type TextProps, type TextStyle } from 'react-native';

export type TextPreset =
  | 'hero'
  | 'title'
  | 'subtitle'
  | 'body'
  | 'bodySmall'
  | 'caption'
  | 'overline';

interface AppTextProps extends TextProps {
  /** Preset tipográfico del DS: hero | title | subtitle | body | bodySmall | caption | overline */
  preset?: TextPreset;
  /** Color de texto override (por defecto usa textPrimary del tema) */
  color?: string;
  children: React.ReactNode;
}

/** Relacion line-height por preset (se aplica sobre el tamaño del tema). */
const lineHeightRatio: Record<TextPreset, number> = {
  hero: 1.6,
  title: 1.5,
  subtitle: 1.5,
  body: 1.7,
  bodySmall: 1.6,
  caption: 1.5,
  overline: 1.5,
};

const letterSpacingByPreset: Record<TextPreset, number> = {
  hero: 2,
  title: 1.5,
  subtitle: 1,
  body: 0.3,
  bodySmall: 0.3,
  caption: 0.3,
  overline: 0.5,
};

/** Presets que usan pixel font (headings) vs mono (body) */
const pixelPresets = new Set<TextPreset>(['hero', 'title', 'subtitle', 'overline']);

export const AppText: React.FC<AppTextProps> = ({
  preset = 'body',
  color,
  style,
  children,
  ...rest
}) => {
  const theme = useAppTheme();

  const resolvedColor = color ?? theme.colors.textPrimary;
  // Tamaño desde el tema → ya incorpora la escala del usuario y reacciona.
  const fontSize = theme.typography.sizes[preset];
  const fontFamily = pixelPresets.has(preset)
    ? theme.typography.fontFamily      // headings
    : theme.typography.fontFamilyMono; // body

  const presetStyle: TextStyle = {
    fontSize,
    fontWeight: '400',
    lineHeight: fontSize * lineHeightRatio[preset],
    letterSpacing: letterSpacingByPreset[preset],
  };

  return (
    <Text
      accessibilityRole="text"
      style={[presetStyle, { color: resolvedColor, fontFamily }, style]}
      {...rest}
    >
      {children}
    </Text>
  );
};
