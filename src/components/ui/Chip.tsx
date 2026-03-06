/**
 * ============================================================================
 * Chip — Componente de categoría/etiqueta del Design System
 * ============================================================================
 *
 * Propósito:
 *   Componente tipo chip/tag para mostrar categorías, filtros o etiquetas.
 *   Soporta estados activo/inactivo con feedback visual.
 *
 * Uso:
 *   <Chip label="Suculentas" />
 *   <Chip label="Interior" active onPress={() => toggleFilter('interior')} />
 *
 * Props:
 *   - label: Texto del chip.
 *   - active: Si el chip está seleccionado/activo (cambia colores).
 *   - onPress: Callback opcional al presionar.
 *   - disabled: Deshabilita la interacción.
 *   - style: Estilos adicionales del contenedor.
 *
 * Variantes:
 *   - default (active=false): Fondo suave, texto sutil.
 *   - active (active=true): Fondo primario, texto blanco.
 *   - disabled: Opacidad reducida, sin interacción.
 *
 * Accesibilidad:
 *   - accessibilityRole="button" cuando es presionable.
 *   - accessibilityState={{ selected: active, disabled }}.
 *   - Área de toque mínima 44pt (Apple HIG).
 *
 * @see docs/DESIGN_SYSTEM.md — Sección B.4 Chip
 * ============================================================================
 */

import { useAppTheme } from '@/src/theme/designSystem';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    type ViewStyle,
} from 'react-native';

interface ChipProps {
  /** Texto mostrado en el chip */
  label: string;
  /** Si el chip está activo/seleccionado */
  active?: boolean;
  /** Callback al presionar */
  onPress?: () => void;
  /** Deshabilita el chip */
  disabled?: boolean;
  /** Estilos adicionales */
  style?: ViewStyle;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  active = false,
  onPress,
  disabled = false,
  style,
}) => {
  const theme = useAppTheme();

  const containerStyle: ViewStyle = {
    backgroundColor: active
      ? theme.colors.primary
      : theme.colors.chipBackground,
    borderWidth: theme.borderWidths.thick,
    borderColor: active ? theme.colors.primary : theme.colors.chipBorder,
    borderRadius: theme.radius.sm,   // Pixel art: mínimo redondeo
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg + 2,
    minHeight: 44, // Apple HIG — área de toque mínima
    justifyContent: 'center',
    alignItems: 'center',
    opacity: disabled ? 0.5 : 1,
  };

  const textColor = active
    ? theme.colors.textOnPrimary
    : theme.colors.chipText;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || !onPress}
      activeOpacity={0.7}
      style={[containerStyle, style]}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active, disabled }}
    >
      <Text
        style={[
          styles.text,
          { color: textColor },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 10,
    fontFamily: 'PressStart2P',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
