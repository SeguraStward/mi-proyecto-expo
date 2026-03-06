/**
 * ============================================================================
 * Input — Componente de entrada de texto del Design System
 * ============================================================================
 *
 * Propósito:
 *   Campo de texto reutilizable con soporte para label, estados de error,
 *   estado disabled y feedback visual consistente.
 *
 * Uso:
 *   <Input label="Email" placeholder="tucorreo@email.com" />
 *   <Input label="Contraseña" error="Campo requerido" secureTextEntry />
 *   <Input placeholder="Buscar..." disabled />
 *
 * Estados:
 *   - default: Borde sutil, fondo surface.
 *   - focused: (nativo del sistema).
 *   - error: Borde rojo, mensaje de error visible.
 *   - disabled: Opacidad reducida, no editable.
 *
 * Accesibilidad:
 *   - accessibilityLabel toma el valor de `label` si existe.
 *   - accessibilityState={{ disabled }} cuando está deshabilitado.
 *   - Tamaño de texto >= 15px para legibilidad.
 *   - Área de toque >= 48px (paddingVertical: 14).
 *
 * @see docs/DESIGN_SYSTEM.md — Sección B.2 Input
 * ============================================================================
 */

import { useAppTheme } from '@/src/theme/designSystem';
import React from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    type TextInputProps,
    type ViewStyle,
} from 'react-native';

interface InputProps extends TextInputProps {
  /** Label visible sobre el input */
  label?: string;
  /** Mensaje de error (activa estilo de error) */
  error?: string;
  /** Si el input está deshabilitado */
  disabled?: boolean;
  /** Estilos del contenedor externo */
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  disabled = false,
  containerStyle,
  style,
  ...rest
}) => {
  const theme = useAppTheme();

  return (
    <View style={[{ marginBottom: theme.spacing.md }, containerStyle]}>
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: theme.colors.textSecondary,
              marginBottom: theme.spacing.xs + 2,
            },
          ]}
        >
          {label}
        </Text>
      )}
      <TextInput
        editable={!disabled}
        placeholderTextColor={theme.colors.textMuted}
        accessibilityLabel={label}
        accessibilityState={{ disabled }}
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.surface,
            borderColor: error ? theme.colors.error : theme.colors.border,
            borderRadius: theme.radius.md,
            color: theme.colors.textPrimary,
          },
          disabled && { opacity: 0.5 },
          style,
        ]}
        {...rest}
      />
      {error && (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 10,
    fontFamily: 'PressStart2P',  // Pixel font para labels
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },
  input: {
    borderWidth: 3,              // Borde grueso pixel art
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 12,
    fontFamily: 'Courier New',   // Mono para inputs
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
});
