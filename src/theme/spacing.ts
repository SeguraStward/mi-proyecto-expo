/**
 * ============================================================================
 * spacing.ts — Escala de espaciado modular base-4 "Retro Garden DS"
 * ============================================================================
 *
 * Propósito:
 *   Define la escala de espaciado (padding, margin, gap) para toda la app.
 *   Sistema lineal basado en múltiplos de 4px, alineado con la grid de
 *   pixel art donde cada "pixel lógico" es un múltiplo de 4.
 *
 * Escala: 4 → 8 → 12 → 16 → 20 → 24 → 32 → 40 → 48
 *
 * Uso:
 *   const theme = useAppTheme();
 *   <View style={{ padding: theme.spacing.md }} />   // 12px
 *   <View style={{ marginBottom: theme.spacing.xl }} /> // 20px
 *
 * @see docs/DESIGN_SYSTEM_RETRO.md — Sección A.3 Espaciado
 * ============================================================================
 */

export interface ThemeSpacing {
  xs: number;     // 4px  — Gaps mínimos entre iconos, padding interno mínimo
  sm: number;     // 8px  — Padding de chips, gaps pequeños
  md: number;     // 12px — Padding de inputs, separación entre elementos
  lg: number;     // 16px — Padding de cards, margen entre secciones
  xl: number;     // 20px — Margen horizontal de pantalla
  '2xl': number;  // 24px — Separación entre secciones
  '3xl': number;  // 32px — Padding vertical de headers
  '4xl': number;  // 40px — Separación de bloques principales
  '5xl': number;  // 48px — Padding top de pantallas (safe area)
}

export const sharedSpacing: ThemeSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
};
