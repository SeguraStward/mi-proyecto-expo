/**
 * ============================================================================
 * borders.ts — Bordes y Radius "Retro Garden DS" (Pixel Art Outlines)
 * ============================================================================
 *
 * Propósito:
 *   Define los valores de border-radius y border-width para el estilo
 *   pixel art. En pixel art clásico los radius suelen ser 0 o muy pequeños
 *   (esquinas cuadradas = bloques de juego), y los bordes son gruesos
 *   (2-3px) para simular los outlines de sprites 8-bit.
 *
 * Filosofía de diseño:
 *   - Radius pequeños (0-4px): Refuerzan la estética blocky/pixelada.
 *   - Bordes gruesos (2-3px): Simulan el "outline" de sprites.
 *   - Sin bordes difuminados: Todo es sólido, como en un juego retro.
 *
 * @see docs/DESIGN_SYSTEM_RETRO.md — Sección A.4 Bordes
 * ============================================================================
 */

export interface ThemeRadius {
  none: number;   // 0px  — Cuadrado perfecto (bloques, sprites)
  sm: number;     // 2px  — Sutileza mínima (chips, badges)
  md: number;     // 4px  — Inputs, botones (ligeramente redondeado)
  lg: number;     // 6px  — Cards (sutil, no rompe la estética pixel)
  xl: number;     // 8px  — Modals, headers
  full: number;   // 999  — Avatares, FABs circulares
}

export interface ThemeBorderWidths {
  thin: number;   // 1px  — Divisores sutiles
  medium: number; // 2px  — Bordes estándar de componentes (outline de sprite)
  thick: number;  // 3px  — Bordes prominentes (cards destacadas, sección activa)
  pixel: number;  // 4px  — Borde máximo tipo bloque de juego
}

export const sharedRadius: ThemeRadius = {
  none: 0,
  sm: 2,
  md: 4,
  lg: 6,
  xl: 8,
  full: 999,
};

export const sharedBorderWidths: ThemeBorderWidths = {
  thin: 1,
  medium: 2,
  thick: 3,
  pixel: 4,
};
