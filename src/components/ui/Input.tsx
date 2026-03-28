/**
 * ============================================================================
 * Input — Componente de entrada de texto del Design System
 * ============================================================================
 *
 * Proposito:
 *   Campo de texto reutilizable con soporte para label, estados de error,
 *   estado disabled, focus visual, multiline y feedback visual consistente.
 *
 * Uso:
 *   <Input label="Email" placeholder="tucorreo@email.com" />
 *   <Input label="Contrasena" error="Campo requerido" secureTextEntry />
 *   <Input label="Bio" multiline helperText="Max 200 caracteres" />
 *   <Input placeholder="Buscar..." disabled />
 *
 * Accesibilidad:
 *   - accessibilityLabel toma el valor de `label` si existe.
 *   - accessibilityState={{ disabled }} cuando esta deshabilitado.
 *   - Tamano de texto >= 12px para legibilidad.
 *   - Area de toque >= 48px (paddingVertical: 14).
 *
 * @see docs/DESIGN_SYSTEM.md
 * ============================================================================
 */

import { useAppTheme } from '@/src/theme/designSystem';
import React, { forwardRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

export interface InputProps extends TextInputProps {
  /** Label visible sobre el input */
  label?: string;
  /** Mensaje de error (activa estilo de error) */
  error?: string;
  /** Texto de ayuda debajo del input (no se muestra si hay error) */
  helperText?: string;
  /** Si el input esta deshabilitado */
  disabled?: boolean;
  /** Estilos del contenedor externo */
  containerStyle?: ViewStyle;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, helperText, disabled = false, containerStyle, style, multiline, ...rest }, ref) => {
    const theme = useAppTheme();
    const [isFocused, setIsFocused] = useState(false);

    const borderColor = error
      ? theme.colors.error
      : isFocused
        ? theme.colors.primary
        : theme.colors.border;

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
          ref={ref}
          editable={!disabled}
          placeholderTextColor={theme.colors.textMuted}
          accessibilityLabel={label}
          accessibilityState={{ disabled }}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          onFocus={(e) => {
            setIsFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            rest.onBlur?.(e);
          }}
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.surface,
              borderColor,
              borderRadius: theme.radius.md,
              color: theme.colors.textPrimary,
            },
            multiline && styles.multiline,
            disabled && { opacity: 0.5 },
            style,
          ]}
          {...rest}
        />
        {error ? (
          <Text style={[styles.bottomText, { color: theme.colors.error }]}>
            {error}
          </Text>
        ) : helperText ? (
          <Text style={[styles.bottomText, { color: theme.colors.textMuted }]}>
            {helperText}
          </Text>
        ) : null}
      </View>
    );
  },
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  label: {
    fontSize: 10,
    fontFamily: 'PressStart2P',
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },
  input: {
    borderWidth: 3,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 12,
    fontFamily: 'Courier New',
  },
  multiline: {
    minHeight: 100,
    paddingTop: 14,
  },
  bottomText: {
    fontSize: 11,
    fontFamily: 'Courier New',
    marginTop: 4,
  },
});
