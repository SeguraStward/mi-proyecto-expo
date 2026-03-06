/**
 * ============================================================================
 * PrimaryButton — Componente de botón principal del Design System
 * ============================================================================
 *
 * Propósito:
 *   Botón de acción principal con soporte para variantes, estados y
 *   feedback visual consistente con el Design System.
 *
 * Uso:
 *   <PrimaryButton title="Identificar Planta" onPress={handleScan} />
 *   <PrimaryButton title="Cancelar" variant="outlined" onPress={handleCancel} />
 *   <PrimaryButton title="Guardando..." loading />
 *   <PrimaryButton title="No disponible" disabled />
 *
 * Variantes:
 *   - filled (default): Fondo primary, texto blanco.
 *   - outlined: Fondo transparente, borde primary, texto primary.
 *
 * Estados:
 *   - default: Color normal.
 *   - pressed: Color pressed del tema (activeOpacity).
 *   - disabled: Opacidad 0.5, no interactivo.
 *   - loading: ActivityIndicator, no interactivo.
 *
 * Accesibilidad:
 *   - accessibilityRole="button".
 *   - accessibilityLabel toma `title`.
 *   - accessibilityState={{ disabled }} cuando disabled o loading.
 *   - Área de toque >= 48px (paddingVertical: 14).
 *
 * @see docs/DESIGN_SYSTEM.md — Sección B.1 PrimaryButton
 * ============================================================================
 */

import { useAppTheme } from '@/src/theme/designSystem';
import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    type TextStyle,
    type ViewStyle,
} from 'react-native';

interface PrimaryButtonProps {
  /** Texto del botón */
  title: string;
  /** Callback al presionar */
  onPress: () => void;
  /** Variante visual: filled | outlined */
  variant?: 'filled' | 'outlined';
  /** Muestra un spinner en vez de texto */
  loading?: boolean;
  /** Deshabilita el botón */
  disabled?: boolean;
  /** Estilos adicionales del contenedor */
  style?: ViewStyle;
  /** Estilos adicionales del texto */
  textStyle?: TextStyle;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  variant = 'filled',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const theme = useAppTheme();
  const isFilled = variant === 'filled';

  const filledStyle: ViewStyle = {
    backgroundColor: theme.colors.primary,
  };

  const outlinedStyle: ViewStyle = {
    backgroundColor: 'transparent',
    borderWidth: 3,
    borderColor: theme.colors.primary,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: disabled || loading }}
      style={[
        styles.base,
        { borderRadius: theme.radius.sm },
        isFilled ? filledStyle : outlinedStyle,
        isFilled && theme.elevation.sm,
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={isFilled ? theme.colors.white : theme.colors.primary}
          size="small"
        />
      ) : (
        <Text
          style={[
            styles.text,
            {
              color: isFilled
                ? theme.colors.textOnPrimary
                : theme.colors.primary,
            },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    borderWidth: 3,
    borderColor: '#1A1A1A',
  },
  disabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  text: {
    fontSize: 11,
    fontFamily: 'PressStart2P',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
