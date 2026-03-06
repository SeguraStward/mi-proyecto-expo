/**
 * ============================================================================
 * PlantCard — Tarjeta de planta estilo pixel art
 * ============================================================================
 *
 * Propósito:
 *   Contenedor tipo "item de inventario RPG" con borde grueso pixelado,
 *   fondo surface y sombra sólida. Pensado para mostrar una planta en
 *   listas o grids con estética 8-bit.
 *
 * Accesibilidad:
 *   - accessibilityRole="button" (si es presionable)
 *   - accessibilityLabel descriptivo
 *
 * Uso:
 *   <PlantCard
 *     name="Monstera"
 *     emoji="🌿"
 *     description="Planta tropical de hojas grandes"
 *     onPress={() => router.push('/plant/1')}
 *   />
 *
 * @see src/theme/index.ts
 * ============================================================================
 */

import type { AppTheme } from '@/src/theme';
import { useAppTheme } from '@/src/theme/designSystem';
import React from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    View,
    type StyleProp,
    type ViewStyle,
} from 'react-native';

// ── Props ─────────────────────────────────────────────────────────────────────

export interface PlantCardProps {
  /** Nombre de la planta */
  name: string;
  /** Emoji o icono representativo */
  emoji?: string;
  /** Descripción corta */
  description?: string;
  /** Nivel / dificultad (RPG-style) */
  level?: string;
  /** Callback al presionar la tarjeta */
  onPress?: () => void;
  /** Estilos adicionales */
  style?: StyleProp<ViewStyle>;
  /** Etiqueta de accesibilidad */
  accessibilityLabel?: string;
}

// ── Componente ────────────────────────────────────────────────────────────────

export function PlantCard({
  name,
  emoji = '🌱',
  description,
  level,
  onPress,
  style,
  accessibilityLabel,
}: PlantCardProps) {
  const theme = useAppTheme();
  const s = getStyles(theme);

  const content = (
    <>
      {/* Fila superior: emoji + nombre + nivel */}
      <View style={s.header}>
        <Text style={s.emoji}>{emoji}</Text>
        <View style={s.headerText}>
          <Text style={s.name} numberOfLines={1}>
            {name}
          </Text>
          {level && <Text style={s.level}>Lv. {level}</Text>}
        </View>
      </View>

      {/* Descripción */}
      {description && (
        <Text style={s.description} numberOfLines={2}>
          {description}
        </Text>
      )}

      {/* Barra decorativa inferior (estilo barra de vida RPG) */}
      <View style={s.hpBarContainer}>
        <View style={s.hpBarFill} />
      </View>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? `Ver detalles de ${name}`}
        style={({ pressed }) => [
          s.container,
          pressed && s.containerPressed,
          style,
        ]}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View
      accessibilityLabel={accessibilityLabel ?? name}
      style={[s.container, style]}
    >
      {content}
    </View>
  );
}

// ── Estilos ───────────────────────────────────────────────────────────────────

function getStyles(t: AppTheme) {
  return StyleSheet.create({
    container: {
      backgroundColor: t.colors.surface,
      borderWidth: t.borderWidths.thick,
      borderColor: t.colors.border,
      borderRadius: t.radius.md,
      padding: t.spacing.lg,
      // Sombra sólida pixel art
      ...t.elevation.sm,
    },

    containerPressed: {
      transform: [{ translateX: 2 }, { translateY: 2 }],
      shadowOpacity: 0,
      elevation: 0,
      borderColor: t.colors.primary,
    },

    // ── Header ───────────────────────────────────
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.md,
      marginBottom: t.spacing.sm,
    },
    emoji: {
      fontSize: 28,
      // Fondo tipo slot de inventario RPG
      backgroundColor: t.colors.surfaceVariant,
      borderWidth: t.borderWidths.medium,
      borderColor: t.colors.border,
      borderRadius: t.radius.sm,
      width: 44,
      height: 44,
      textAlign: 'center',
      lineHeight: 42,
      overflow: 'hidden',
    },
    headerText: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    name: {
      fontFamily: t.typography.fontFamily,
      fontSize: t.typography.sizes.body,
      color: t.colors.textPrimary,
      flex: 1,
    },
    level: {
      fontFamily: t.typography.fontFamilyMono,
      fontSize: t.typography.sizes.caption,
      color: t.colors.secondary,
      backgroundColor: t.colors.surfaceVariant,
      borderWidth: t.borderWidths.thin,
      borderColor: t.colors.border,
      borderRadius: t.radius.sm,
      paddingHorizontal: t.spacing.sm,
      paddingVertical: 2,
      overflow: 'hidden',
    },

    // ── Descripción ──────────────────────────────
    description: {
      fontFamily: t.typography.fontFamilyMono,
      fontSize: t.typography.sizes.caption,
      color: t.colors.textSecondary,
      lineHeight: t.typography.sizes.caption * t.typography.lineHeights.relaxed,
      marginBottom: t.spacing.md,
    },

    // ── Barra de vida decorativa ─────────────────
    hpBarContainer: {
      height: 6,
      backgroundColor: t.colors.surfaceVariant,
      borderWidth: t.borderWidths.thin,
      borderColor: t.colors.border,
      borderRadius: t.radius.none,
      overflow: 'hidden',
    },
    hpBarFill: {
      height: '100%',
      width: '80%',
      backgroundColor: t.colors.primary,
      borderRadius: 0,
    },
  });
}

export default PlantCard;
