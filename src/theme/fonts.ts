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
 * Escala tipográfica fluida (7 niveles — ratio ~1.15):
 *   hero (24px) → title (20px) → subtitle (16px) → body (15px)
 *   → bodySmall (14px) → caption (13px) → overline (11px)
 *
 * Nota: PressStart2P renderiza más pequeña que su nominal, por lo que
 * los presets que usan pixel font (hero, title, subtitle, overline)
 * se ven proporcionalmente más chicos. Body y menores usan Courier New
 * (mono) para legibilidad en párrafos largos.
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
    hero: 24,       // Pantallas de bienvenida, titulos grandes (pixel)
    title: 20,      // Titulos principales (pixel)
    subtitle: 16,   // Subtitulos, titulos de seccion (pixel)
    body: 15,       // Texto principal legible (mono)
    bodySmall: 14,  // Texto secundario (mono)
    caption: 13,    // Labels, timestamps, metadata (mono)
    overline: 11,   // Chips, badges, tiny labels (pixel)
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeights: {
    tight: 1.4,     // Mas espacio que sans-serif porque pixel font es densa
    normal: 1.6,
    relaxed: 1.8,
  },
};
