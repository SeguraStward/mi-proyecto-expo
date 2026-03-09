/**
 * ============================================================================
 * colors.ts — Paleta de colores "Retro Garden" (Estética 8-bit)
 * ============================================================================
 *
 * Propósito:
 *   Define la paleta completa de colores del "Retro Garden DS".
 *   Inspirada en jardines retro de videojuegos 2D clásicos (8-bit/16-bit).
 *
 *   Metáfora del jardín — cada color tiene un significado:
 *     🟤 CAFÉ/TIERRA → Background, la tierra donde todo crece
 *     🟢 VERDE       → Cards, botones, CTAs — las plantas
 *     🌞 AMARILLO    → Acentos, badges, highlights — el sol / la luz
 *     ⬜ BLANCO      → Bordes, divisores — las cercas del jardín
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

// ── Light Mode — "Primavera en la granja" ────────────────────────────────────
//
// Fondo = pergamino calido (estetica Stardew Valley UI),
// cards = papel envejecido, acentos = cosecha ambar,
// bordes = cercas verdes del jardin.
//

export const lightColors: ThemeColors = {
  // Verdes — vegetacion, botones, CTAs
  primary: '#386641',        // Bosque profundo (botones principales)
  primaryLight: '#6A994E',   // Verde pradera (hover, iconos activos)
  primarySoft: '#B7D8A0',    // Hoja primavera (fondos suaves)
  primaryPale: '#DCE8D2',    // Verde palido (indicador activo M3)
  pressed: '#2D5233',        // Bosque oscuro al presionar
  secondary: '#BC6C25',      // Madera calida / cosecha (acentos, badges)

  // Fondos — pergamino calido (estetica Stardew Valley)
  background: '#FEFAE0',     // Pergamino (fondo general)
  surface: '#F0E6CE',        // Papel envejecido (cards — distincion visible)
  surfaceVariant: '#E6DBC4', // Papel profundo (secciones alternativas)

  // Texto — legible sobre pergamino y papel (WCAG AA verificado)
  textPrimary: '#2B1D0E',    // Tinta oscura (15.5:1 sobre fondo)
  textSecondary: '#594A3C',  // Cafe medio (8.1:1 sobre fondo)
  textMuted: '#6E5F50',      // Madera gastada (5.8:1 — cumple AA)
  textOnPrimary: '#FFFFFF',  // Blanco sobre verde

  // Bordes — cercas de jardin pixel art
  border: '#386641',         // Verde bosque (borde tipo sprite)
  divider: '#D4CCBA',        // Divisor sutil calido

  success: '#386641',        // Verde exito
  warning: '#DDA15E',        // Ambar cosecha
  error: '#AE2012',          // Rojo profundo (6.7:1 sobre fondo)
  info: '#457B9D',           // Azul cielo
  disabled: '#C5B9A8',       // Madera destenida

  // Chips — hojas pequenas
  chipBackground: '#DCE8D2', // Verde palido
  chipText: '#386641',       // Verde bosque
  chipBorder: '#6A994E',     // Verde pradera

  white: '#FFFFFF',
  black: '#000000',
  shadow: '#2B1D0E',         // Sombra tierra solida (pixel art)
  overlay: '#2B1D0E80',
};

// ── Dark Mode — "Noche estrellada en la granja" ─────────────────────────────
//
// Fondo = suelo nocturno profundo, cards = panel de madera oscura,
// acentos = oro de linterna calida, bordes = cercas bajo la luna.
//

export const darkColors: ThemeColors = {
  // Verdes — vegetacion bajo la luna
  primary: '#7BC67E',        // Esmeralda brillante (luna)
  primaryLight: '#9ED8A0',   // Verde resplandor claro
  primarySoft: '#2A5C2F',    // Bosque profundo (indicador oscuro)
  primaryPale: '#1E3D22',    // Verde muy oscuro
  pressed: '#A8E0AA',        // Verde brillante al presionar
  secondary: '#E8B86D',      // Oro de linterna calida (acentos)

  // Fondos — tierra nocturna profunda
  background: '#1C1410',     // Suelo nocturno (jardin de noche)
  surface: '#2C231A',        // Panel de madera oscura (cards)
  surfaceVariant: '#382E22', // Madera ligeramente mas clara

  // Texto — legible en la oscuridad (WCAG AA verificado)
  textPrimary: '#F2E8D5',    // Luz de luna calida (15.1:1 sobre fondo)
  textSecondary: '#C8BA9F',  // Pergamino iluminado (9.7:1 sobre fondo)
  textMuted: '#A49585',      // Madera distante (4.7:1 — cumple AA)
  textOnPrimary: '#1C1410',  // Oscuro sobre verde brillante

  // Bordes — cercas de madera bajo la luna
  border: '#7B6B52',         // Madera iluminada
  divider: '#3D3225',        // Madera oscura divisor

  success: '#7BC67E',        // Verde luna
  warning: '#E8B86D',        // Oro linterna
  error: '#F07167',          // Rojo calido
  info: '#64B5F6',           // Cielo nocturno
  disabled: '#4E4035',       // Madera oscura inactiva

  // Chips — brotes nocturnos
  chipBackground: '#2A5C2F', // Bosque profundo
  chipText: '#9ED8A0',       // Verde claro
  chipBorder: '#7BC67E',     // Verde luna

  white: '#FFFFFF',
  black: '#000000',
  shadow: '#000000',         // Sombra nocturna
  overlay: '#000000AA',
};
