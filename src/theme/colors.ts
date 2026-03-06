/**
 * ============================================================================
 * colors.ts — Paleta de colores "Retro Garden" (Estética 8-bit)
 * ============================================================================
 *
 * Propósito:
 *   Define la paleta completa de colores del "Retro Garden DS".
 *   Inspirada en jardines retro de videojuegos 2D clásicos (8-bit/16-bit).
 *
 *   Usa tres familias cromáticas de forma estratégica:
 *     🟢 VERDE  → Acciones primarias, vida, crecimiento (CTAs, iconos activos)
 *     ⬜ BLANCO/CREMA → Superficies, respiración, claridad
 *     🟤 CAFÉ/TIERRA → Anclaje, calidez, bordes, navegación
 *
 *   Incluye estados interactivos (pressed, disabled) para cada color semántico,
 *   cumpliendo con WCAG AA en contraste (≥ 4.5:1 para texto normal).
 *
 * @see docs/DESIGN_SYSTEM_RETRO.md — Sección A.1 Colores
 * ============================================================================
 */

/** Interfaz completa de colores con estados (disabled, pressed) */
export interface ThemeColors {
  // Primarios
  primary: string;
  primaryLight: string;
  primarySoft: string;
  primaryPale: string;
  pressed: string;
  secondary: string;

  // Superficies y fondos
  background: string;
  surface: string;
  surfaceVariant: string;

  // Texto
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textOnPrimary: string;

  // Bordes y divisores
  border: string;
  divider: string;

  // Estados semánticos
  success: string;
  warning: string;
  error: string;
  info: string;
  disabled: string;

  // Chips
  chipBackground: string;
  chipText: string;
  chipBorder: string;

  // Utilitarios
  white: string;
  black: string;
  shadow: string;
  overlay: string;
}

// ── Light Mode — "Garden Day" (crema + verde + tierra) ──────────────────────

export const lightColors: ThemeColors = {
  primary: '#38B000',        // Verde lima intenso (CTA, vida)
  primaryLight: '#70E000',
  primarySoft: '#C6EBBE',    // Verde suave (fondos sutiles)
  primaryPale: '#E8F5E1',    // Verde pálido (hover states)
  pressed: '#2D8C00',        // Primary al presionar
  secondary: '#795548',      // CAFÉ — tierra cálida (navegación, anclas)

  background: '#FFFDF7',     // Crema cálido (sol de jardín)
  surface: '#FFFFFF',        // Blanco puro (tarjetas limpias)
  surfaceVariant: '#F5F0E8', // Pergamino cálido (secciones alternas)

  textPrimary: '#2D2018',    // Marrón muy oscuro (legibilidad cálida)
  textSecondary: '#5D4037',  // Café medio
  textMuted: '#9E8E82',      // Gris cálido terroso
  textOnPrimary: '#FFFFFF',

  border: '#8D6E63',         // Café medio (outline tipo sprite)
  divider: '#D7CCC8',        // Café clarito

  success: '#4CAF50',
  warning: '#FFB300',        // Ámbar cálido (moneda RPG)
  error: '#E53935',          // Rojo cálido retro
  info: '#2979FF',
  disabled: '#BCAAA4',       // Café deshabilitado

  chipBackground: '#EFEBE9', // Café ultra claro
  chipText: '#4E342E',       // Café oscuro
  chipBorder: '#BCAAA4',     // Café medio

  white: '#FFFFFF',
  black: '#000000',
  shadow: '#3E2723',         // Sombra café oscuro (pixel art)
  overlay: '#3E272380',
};

// ── Dark Mode — "Garden Night" (tierra oscura + verde brillante) ────────────

export const darkColors: ThemeColors = {
  primary: '#66BB6A',        // Verde esmeralda suave
  primaryLight: '#81C784',
  primarySoft: '#2E7D32',    // Verde bosque profundo
  primaryPale: '#1B3D1B',    // Verde casi negro
  pressed: '#81C784',        // Verde claro al presionar
  secondary: '#BCAAA4',      // Café claro cálido (ancla en oscuro)

  background: '#1A120B',     // Tierra profunda (noche de jardín)
  surface: '#2D1F14',        // Café oscuro (tarjetas)
  surfaceVariant: '#3E2C1C', // Café medio oscuro

  textPrimary: '#F5F0E8',    // Crema cálido (papel iluminado por luna)
  textSecondary: '#BCAAA4',  // Café claro
  textMuted: '#8D7B6E',      // Gris terroso
  textOnPrimary: '#1A120B',

  border: '#5D4037',         // Café medio (bordes de sprite)
  divider: '#3E2723',        // Café muy oscuro

  success: '#66BB6A',
  warning: '#FFD54F',        // Dorado cálido
  error: '#EF5350',
  info: '#42A5F5',
  disabled: '#4E342E',       // Café deshabilitado

  chipBackground: '#3E2723', // Café oscuro
  chipText: '#BCAAA4',       // Café claro
  chipBorder: '#5D4037',     // Café medio

  white: '#FFFFFF',
  black: '#000000',
  shadow: '#000000',
  overlay: '#000000AA',
};
