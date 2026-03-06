/**
 * ============================================================================
 * typography.ts — Tipografía "Retro Garden DS" (Pixel Art / Monospaced)
 * ============================================================================
 *
 * Propósito:
 *   Define familias tipográficas, escala de tamaños, pesos y line-heights
 *   para la estética pixel art 8-bit/16-bit.
 *
 *   Familia principal: "PressStart2P" (Google Fonts) — fuente pixelada auténtica.
 *   Familia fallback: "Courier New" / monospace — mantiene el look de terminal.
 *
 * Importante:
 *   La fuente "PressStart2P" DEBE cargarse via expo-font antes de usarse.
 *   Ver app/_layout.tsx para la carga con useFonts().
 *   La fuente pixelada es más pequeña visualmente, por lo que los tamaños
 *   son ligeramente mayores que en una fuente sans-serif convencional.
 *
 * Escala tipográfica (7 niveles):
 *   hero (24px) → title (18px) → subtitle (14px) → body (12px)
 *   → bodySmall (10px) → caption (9px) → overline (8px)
 *
 * @see docs/DESIGN_SYSTEM_RETRO.md — Sección A.2 Tipografía
 * ============================================================================
 */

export interface ThemeTypography {
  /** Fuente principal pixelada (Press Start 2P) */
  fontFamily: string;
  /** Fuente monospaced para body text (más legible que pixel en párrafos largos) */
  fontFamilyMono: string;
  sizes: {
    hero: number;
    title: number;
    subtitle: number;
    body: number;
    bodySmall: number;
    caption: number;
    overline: number;
  };
  weights: {
    regular: '400';
    medium: '500';
    semibold: '600';
    bold: '700';
  };
  lineHeights: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

/**
 * Nombre de la fuente una vez cargada con expo-font.
 * Se usa así en los componentes: { fontFamily: PIXEL_FONT }
 */
export const PIXEL_FONT = 'PressStart2P';
export const MONO_FONT = 'Courier New';

export const sharedTypography: ThemeTypography = {
  fontFamily: PIXEL_FONT,
  fontFamilyMono: MONO_FONT,
  sizes: {
    hero: 24,       // Pantallas de bienvenida, títulos grandes
    title: 18,      // Títulos principales — más pequeño que sans-serif por la fuente pixel
    subtitle: 14,   // Subtítulos, títulos de sección
    body: 12,       // Texto principal
    bodySmall: 10,  // Texto secundario
    caption: 9,     // Labels, timestamps
    overline: 8,    // Chips, badges
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeights: {
    tight: 1.4,     // Más espacio que sans-serif porque pixel font es densa
    normal: 1.6,
    relaxed: 1.8,
  },
};
