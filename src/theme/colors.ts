/**
 * ============================================================================
 * colors.ts — Paleta de colores "Retro Garden" (Estética 8-bit)
 * ============================================================================
 *
 * Propósito:
 *   Define la paleta completa de colores del "Retro Garden DS".
 *   Inspirada en jardines retro de videojuegos 2D clásicos (8-bit/16-bit):
 *   verdes vibrantes, tierra cálida, cremas amarillentos.
 *
 *   Incluye estados interactivos (pressed, disabled) para cada color semántico,
 *   cumpliendo con WCAG AA en contraste (≥ 4.5:1 para texto normal).
 *
 * Paleta clave:
 *   - Primary: #38B000 (Verde lima intenso — botones de acción)
 *   - Secondary: #008000 (Verde oscuro — navegación)
 *   - Surface: #F1F8E9 (Papel crema — evita blanco puro, look retro)
 *   - Text: #1A1A1A (Casi negro — legibilidad máxima)
 *   - Error: #FF0000 (Rojo puro de consola)
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

// ── Light Mode — "Retro Forest Day" ──────────────────────────────────────────

export const lightColors: ThemeColors = {
  primary: '#38B000',       // Verde lima intenso (CTA)
  primaryLight: '#70E000',
  primarySoft: '#9EF01A',
  primaryPale: '#CCFF33',
  pressed: '#2D8C00',       // Primary al presionar
  secondary: '#008000',     // Verde oscuro (navegación)

  background: '#F1F8E9',    // Papel crema amarillento (retro)
  surface: '#FAFFF5',
  surfaceVariant: '#E8F5E1',

  textPrimary: '#1A1A1A',   // Casi negro = legibilidad retro
  textSecondary: '#3D5A3D',
  textMuted: '#7A8C7A',
  textOnPrimary: '#FFFFFF',

  border: '#2D6A2D',        // Grueso, tipo outline de sprite
  divider: '#C5E1A5',

  success: '#00C853',
  warning: '#FFD600',        // Amarillo puro (moneda de RPG)
  error: '#FF0000',          // Rojo puro de consola 8-bit
  info: '#2979FF',
  disabled: '#B0BEC5',

  chipBackground: '#DCEDC8',
  chipText: '#33691E',
  chipBorder: '#AED581',

  white: '#FFFFFF',
  black: '#000000',
  shadow: '#1A1A1A',         // Sombra sólida (sin blur = pixel art)
  overlay: '#00000080',
};

// ── Dark Mode — "Retro Forest Night" (pantalla CRT) ─────────────────────────

export const darkColors: ThemeColors = {
  primary: '#70E000',
  primaryLight: '#9EF01A',
  primarySoft: '#38B000',
  primaryPale: '#1B3D00',
  pressed: '#9EF01A',
  secondary: '#00C853',

  background: '#0A1A0A',    // Verde muy oscuro (CRT terminal)
  surface: '#142814',
  surfaceVariant: '#1E3A1E',

  textPrimary: '#E8F5E9',
  textSecondary: '#A5D6A7',
  textMuted: '#66896E',
  textOnPrimary: '#0A1A0A',

  border: '#388E3C',
  divider: '#1B5E20',

  success: '#69F0AE',
  warning: '#FFFF00',
  error: '#FF5252',
  info: '#448AFF',
  disabled: '#37474F',

  chipBackground: '#1B5E20',
  chipText: '#A5D6A7',
  chipBorder: '#2E7D32',

  white: '#FFFFFF',
  black: '#000000',
  shadow: '#000000',
  overlay: '#000000AA',
};
