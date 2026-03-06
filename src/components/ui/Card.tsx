/**
 * ============================================================================
 * Card — Componente de tarjeta del Design System
 * ============================================================================
 *
 * Propósito:
 *   Contenedor visual tipo tarjeta para agrupar contenido relacionado.
 *   Soporta dos variantes: elevated (con sombra) y outlined (con borde).
 *
 * Uso:
 *   <Card>Contenido...</Card>
 *   <Card variant="outlined">Contenido con borde...</Card>
 *
 * Variantes:
 *   - elevated (default): Fondo surface con sombra md.
 *   - outlined: Fondo surface con borde, sin sombra.
 *
 * Accesibilidad:
 *   - Actúa como contenedor, no interactivo por defecto.
 *
 * @see docs/DESIGN_SYSTEM.md — Sección B.3 Card
 * ============================================================================
 */

import { useAppTheme } from '@/src/theme/designSystem';
import React from 'react';
import { View, type ViewStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  /** Variante visual: elevated (con sombra) | outlined (con borde) */
  variant?: 'elevated' | 'outlined';
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevated',
  style,
}) => {
  const theme = useAppTheme();

  // Retro pixel art: bordes gruesos, radios mínimos, sombra sólida
  const baseStyle: ViewStyle = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,         // Pixel art: bajo redondeo
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.lg,
    borderWidth: theme.borderWidths.thick,  // Borde tipo sprite
    borderColor: theme.colors.border,
  };

  const variantStyle: ViewStyle =
    variant === 'outlined'
      ? {
          borderColor: theme.colors.primary,
        }
      : {
          ...theme.elevation.sm,            // Sombra sólida pixel art
        };

  return <View style={[baseStyle, variantStyle, style]}>{children}</View>;
};
