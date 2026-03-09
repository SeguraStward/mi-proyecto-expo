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
 * Uso:
 *   <AppText preset="title">Mi Título</AppText>
 *   <AppText preset="caption" color={theme.colors.textMuted}>Fecha</AppText>
 *
 * Props:
 *   - preset: Define tamaño, peso y line-height según el DS.
 *   - color: Override opcional del color de texto.
 *   - style: Estilos adicionales de React Native.
 *   - children: Contenido textual.
 *   - ...rest: Todas las props de React Native Text (numberOfLines, etc.).
 *
 * Accesibilidad:
 *   - accessibilityRole="text" por defecto para lectores de pantalla.
 *   - Hereda props de accesibilidad de Text.
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

/**
 * Mapea cada preset a su estilo tipográfico.
 * Hero/Title/Subtitle/Overline usan la fuente pixel (Press Start 2P).
 * Body y menores usan la fuente mono (Courier New) para legibilidad.
 *
 * Escala fluida — ratio ~1.15 entre niveles adyacentes:
 *   hero(24) → title(20) → subtitle(16) → body(15) → bodySmall(14) → caption(13) → overline(11)
 */
const presetStyles: Record<TextPreset, TextStyle> = {
  hero:      { fontSize: 24, fontWeight: '400', lineHeight: 24 * 1.6, letterSpacing: 2 },
  title:     { fontSize: 20, fontWeight: '400', lineHeight: 20 * 1.5, letterSpacing: 1.5 },
  subtitle:  { fontSize: 16, fontWeight: '400', lineHeight: 16 * 1.5, letterSpacing: 1 },
  body:      { fontSize: 15, fontWeight: '400', lineHeight: 15 * 1.7, letterSpacing: 0.3 },
  bodySmall: { fontSize: 14, fontWeight: '400', lineHeight: 14 * 1.6, letterSpacing: 0.3 },
  caption:   { fontSize: 13, fontWeight: '400', lineHeight: 13 * 1.5, letterSpacing: 0.3 },
  overline:  { fontSize: 11, fontWeight: '400', lineHeight: 11 * 1.5, letterSpacing: 0.5 },
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
  const presetStyle = presetStyles[preset];
  const fontFamily = pixelPresets.has(preset)
    ? theme.typography.fontFamily      // Press Start 2P
    : theme.typography.fontFamilyMono; // Courier New

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
