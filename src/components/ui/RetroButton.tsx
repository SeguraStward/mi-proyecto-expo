/**
 * ============================================================================
 * RetroButton — Botón estilo 8-bit / pixel art
 * ============================================================================
 *
 * Propósito:
 *   Botón con sombra sólida (sin degradados ni blur) que simula un bloque
 *   de juego retro. Soporta variantes filled/outlined, estados loading,
 *   disabled y pressed con feedback visual tipo "push".
 *
 * Accesibilidad:
 *   - accessibilityRole="button"
 *   - accessibilityState.disabled
 *   - accessibilityState.busy (loading)
 *   - Contraste WCAG AA mínimo 4.5:1
 *
 * Uso:
 *   <RetroButton label="🌱 Plantar" onPress={handlePlant} />
 *   <RetroButton label="Cancelar" variant="outlined" onPress={handleCancel} />
 *
 * @see src/theme/index.ts
 * ============================================================================
 */

import type { AppTheme } from '@/src/theme';
import { useAppTheme } from '@/src/theme/designSystem';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    type StyleProp,
    type TextStyle,
    type ViewStyle,
} from 'react-native';

// ── Props ─────────────────────────────────────────────────────────────────────

export interface RetroButtonProps {
  /** Texto del botón */
  label: string;
  /** Callback al presionar */
  onPress?: () => void;
  /** Variante visual */
  variant?: 'filled' | 'outlined';
  /** Estado de carga */
  loading?: boolean;
  /** Estado deshabilitado */
  disabled?: boolean;
  /** Estilos adicionales del contenedor */
  style?: StyleProp<ViewStyle>;
  /** Estilos adicionales del texto */
  textStyle?: StyleProp<TextStyle>;
  /** Etiqueta de accesibilidad customizada */
  accessibilityLabel?: string;
}

// ── Componente ────────────────────────────────────────────────────────────────

export function RetroButton({
  label,
  onPress,
  variant = 'filled',
  loading = false,
  disabled = false,
  style,
  textStyle,
  accessibilityLabel,
}: RetroButtonProps) {
  const theme = useAppTheme();
  const styles = getStyles(theme);
  const [isPressed, setIsPressed] = useState(false);

  const isDisabled = disabled || loading;

  const handlePressIn = useCallback(() => setIsPressed(true), []);
  const handlePressOut = useCallback(() => setIsPressed(false), []);

  // ── Estilos dinámicos según estado ──────────────────────────────────────

  const containerStyle: ViewStyle = {
    ...styles.base,
    ...(variant === 'filled' ? styles.filled : styles.outlined),
    // Sombra sólida desplazada (efecto bloque retro)
    ...(!isPressed && !isDisabled ? styles.shadow : {}),
    // Efecto "push" al presionar: se desplaza como si se empujara el botón
    ...(isPressed && !isDisabled ? styles.pressed : {}),
    // Deshabilitado
    ...(isDisabled ? styles.disabled : {}),
  };

  const labelStyle: TextStyle = {
    ...styles.label,
    ...(variant === 'filled' ? styles.labelFilled : styles.labelOutlined),
    ...(isDisabled ? styles.labelDisabled : {}),
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={[containerStyle, style]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'filled' ? theme.colors.textOnPrimary : theme.colors.primary}
        />
      ) : (
        <Text style={[labelStyle, textStyle]}>{label}</Text>      )}
    </Pressable>
  );
}

// ── Estilos ───────────────────────────────────────────────────────────────────

function getStyles(t: AppTheme) {
  return StyleSheet.create({
    base: {
      paddingVertical: t.spacing.md,
      paddingHorizontal: t.spacing.xl,
      borderRadius: t.radius.sm,            // Muy poco redondeo → pixel art
      borderWidth: t.borderWidths.thick,      // Borde grueso sprite
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 48,
    },

    // ── Variantes ────────────────────────────────
    filled: {
      backgroundColor: t.colors.primary,
      borderColor: t.colors.black,
    },
    outlined: {
      backgroundColor: 'transparent',
      borderColor: t.colors.primary,
    },

    // ── Sombra sólida (sin blur) ─────────────────
    shadow: {
      ...t.elevation.md,
    },

    // ── Efecto push al presionar ─────────────────
    pressed: {
      transform: [{ translateX: 3 }, { translateY: 3 }],
      // Sin sombra cuando está presionado (el botón "baja")
      shadowOpacity: 0,
      elevation: 0,
    },

    // ── Deshabilitado ────────────────────────────
    disabled: {
      backgroundColor: t.colors.disabled,
      borderColor: t.colors.border,
      shadowOpacity: 0,
      elevation: 0,
    },

    // ── Texto ────────────────────────────────────
    label: {
      fontFamily: t.typography.fontFamily,
      fontSize: t.typography.sizes.bodySmall,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    labelFilled: {
      color: t.colors.textOnPrimary,
    },
    labelOutlined: {
      color: t.colors.primary,
    },
    labelDisabled: {
      color: t.colors.textMuted,
    },
  });
}

export default RetroButton;
