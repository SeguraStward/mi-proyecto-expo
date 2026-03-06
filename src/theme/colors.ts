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

// ── Light Mode — "Jardín de Día" ─────────────────────────────────────────────
//
// Fondo = tierra cálida clara, cards = verde fresco, acentos = sol amarillo,
// bordes = cercas blancas del jardín.
//

export const lightColors: ThemeColors = {
  // 🌿 Verde = plantas, botones, CTAs
  primary: '#2E7D32',        // Verde bosque (botones principales)
  primaryLight: '#4CAF50',   // Verde medio (hover, iconos activos)
  primarySoft: '#A5D6A7',    // Verde medio suave (fondo de cards)
  primaryPale: '#C8E6C9',    // Verde pálido (estados hover)
  pressed: '#1B5E20',        // Verde oscuro al presionar
  secondary: '#F9A825',      // 🌞 Amarillo sol (acentos, badges)

  // 🟤 Café/tierra = fondo del jardín
  background: '#D7CCC8',     // Tierra media (la parcela del jardín)
  surface: '#C8E6C9',        // Verde suave notorio (cards = las plantas)
  surfaceVariant: '#FFF8E1', // Amarillo crema (secciones alternativas = luz)

  // Texto — legible sobre tierra y verde
  textPrimary: '#1B0F0A',    // Café casi negro (máxima legibilidad)
  textSecondary: '#3E2723',  // Café oscuro
  textMuted: '#5D4037',      // Café medio
  textOnPrimary: '#FFFFFF',  // Blanco sobre verde

  // 🌿 Bordes verdes = tallos y ramas del jardín
  border: '#2E7D32',         // Verde bosque (borde tipo sprite)
  divider: '#A5D6A7',        // Verde medio (caminos entre plantas)

  success: '#43A047',
  warning: '#FFB300',        // Sol ámbar (moneda RPG)
  error: '#E53935',          // Rojo retro
  info: '#1E88E5',           // Cielo
  disabled: '#BCAAA4',       // Tierra seca

  // Chips = plantas pequeñas
  chipBackground: '#A5D6A7', // Verde medio suave
  chipText: '#1B5E20',       // Verde oscuro
  chipBorder: '#2E7D32',     // Verde bosque borde

  white: '#FFFFFF',
  black: '#000000',
  shadow: '#3E2723',         // Sombra tierra (pixel art sólido)
  overlay: '#3E272380',
};

// ── Dark Mode — "Jardín de Noche" ────────────────────────────────────────────
//
// Fondo = tierra oscura profunda, cards = verde oscuro, acentos = luciérnagas
// amarillas, bordes = cercas de madera clara bajo la luna.
//

export const darkColors: ThemeColors = {
  // 🌿 Verde = plantas bajo la luna
  primary: '#66BB6A',        // Verde esmeralda brillante
  primaryLight: '#81C784',   // Verde claro (hover)
  primarySoft: '#1B5E20',    // Verde bosque profundo
  primaryPale: '#0D3B0D',    // Verde casi negro
  pressed: '#A5D6A7',        // Verde claro al presionar
  secondary: '#FFD54F',      // 🌙 Amarillo luciérnaga (acentos nocturnos)

  // 🟤 Tierra profunda de noche
  background: '#1A120B',     // Tierra oscura (noche de jardín)
  surface: '#1B3A1B',        // Verde muy oscuro (cards = plantas nocturnas)
  surfaceVariant: '#2D1F14', // Café oscuro (secciones alternativas)

  // Texto — legible en la oscuridad
  textPrimary: '#F1F8E9',    // Verde blanquecino (hojas a la luz de luna)
  textSecondary: '#C8E6C9',  // Verde claro
  textMuted: '#8D6E63',      // Café medio (tierra lejana)
  textOnPrimary: '#0D3B0D',  // Verde muy oscuro sobre verde brillante

  // ⬜ Cercas de madera clara bajo la luna
  border: '#A1887F',         // Madera clara (cercas iluminadas)
  divider: '#4E342E',        // Madera oscura

  success: '#66BB6A',
  warning: '#FFD54F',        // Luciérnaga dorada
  error: '#EF5350',
  info: '#42A5F5',           // Cielo nocturno
  disabled: '#4E342E',       // Tierra seca nocturna

  // Chips = brotes nocturnos
  chipBackground: '#1B5E20', // Verde bosque
  chipText: '#A5D6A7',       // Verde claro
  chipBorder: '#2E7D32',     // Verde medio

  white: '#FFFFFF',
  black: '#000000',
  shadow: '#000000',
  overlay: '#000000AA',
};
