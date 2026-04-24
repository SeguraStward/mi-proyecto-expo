/**
 * ============================================================================
 * PlantCard — Filled Card estilo Material Design 3
 * ============================================================================
 *
 * Layout:
 *   Imagen arriba (~65%) + bloque de texto abajo (~35%) con fondo surface.
 *   El texto nunca se superpone a la imagen.
 *
 * Jerarquia visual:
 *   1. Nombre de planta   — pixel font, textPrimary, bodySmall
 *   2. Nombre cientifico  — mono font, textSecondary, overline, italica
 *
 * Accesibilidad:
 *   - accessibilityRole="button" (si es presionable)
 *   - accessibilityLabel descriptivo
 *
 * @see src/theme/index.ts
 * ============================================================================
 */

import type { AppTheme } from '@/src/theme';
import { useAppTheme } from '@/src/theme/designSystem';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
    type StyleProp,
    type ViewStyle,
} from 'react-native';

// ── Props ─────────────────────────────────────────────────────────────────────

export interface PlantCardProps {
  /** Nombre comun de la planta */
  name: string;
  /** Nombre cientifico (italica, debajo del nombre) */
  scientificName?: string;
  /** URI de la imagen de la planta */
  imageUri?: string;
  /** Nombre del icono MaterialCommunityIcons (fallback si no hay imageUri) */
  iconName?: string;
  /** Color del icono (por defecto: primary del tema) */
  iconColor?: string;
  /** Indica que la planta esta pendiente de sincronizar (creada offline) */
  pending?: boolean;
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
  scientificName,
  imageUri,
  iconName = 'leaf',
  iconColor,
  pending = false,
  onPress,
  style,
  accessibilityLabel,
}: PlantCardProps) {
  const theme = useAppTheme();
  const s = getStyles(theme);
  const resolvedIconColor = iconColor ?? theme.colors.primary;

  const content = (
    <>
      {/* Bloque de imagen (~65%) */}
      <View style={s.imageBlock}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
            accessibilityLabel={`Foto de ${name}`}
          />
        ) : (
          <View style={[StyleSheet.absoluteFill, s.iconFallback]}>
            <MaterialCommunityIcons
              name={iconName as any}
              size={40}
              color={resolvedIconColor}
            />
          </View>
        )}
        {pending ? (
          <View style={s.pendingBadge}>
            <MaterialCommunityIcons
              name="cloud-upload-outline"
              size={12}
              color={theme.colors.textOnPrimary}
            />
            <Text style={s.pendingText}>PENDIENTE</Text>
          </View>
        ) : null}
      </View>

      {/* Bloque de texto — fondo solido, nunca sobre la imagen */}
      <View style={s.textBlock}>
        <Text style={s.name}>{name}</Text>
        {scientificName && (
          <Text style={s.scientific}>{scientificName}</Text>
        )}
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
      flex: 1,
      borderWidth: t.borderWidths.thick,
      borderColor: t.colors.border,
      borderRadius: t.radius.md,
      overflow: 'hidden',
      backgroundColor: t.colors.surface,
      ...t.elevation.sm,
    },

    containerPressed: {
      transform: [{ scale: 0.97 }],
      borderColor: t.colors.primary,
    },

    // ── Imagen (parte superior) ──────────────────
    imageBlock: {
      aspectRatio: 1,
      overflow: 'hidden',
    },

    iconFallback: {
      backgroundColor: t.colors.surfaceVariant,
      alignItems: 'center',
      justifyContent: 'center',
    },

    // ── Texto (parte inferior, fondo solido) ─────
    textBlock: {
      padding: t.spacing.md,
      backgroundColor: t.colors.surface,
    },

    name: {
      fontFamily: t.typography.fontFamily,
      fontSize: t.typography.sizes.bodySmall,
      color: t.colors.textPrimary,
    },
    scientific: {
      fontFamily: t.typography.fontFamilyMono,
      fontSize: t.typography.sizes.overline,
      color: t.colors.textSecondary,
      fontStyle: 'italic',
      marginTop: 2,
    },
    pendingBadge: {
      position: 'absolute',
      top: t.spacing.xs,
      right: t.spacing.xs,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: t.colors.warning,
      borderWidth: t.borderWidths.thin,
      borderColor: t.colors.border,
      borderRadius: t.radius.sm,
      paddingHorizontal: 6,
      paddingVertical: 3,
    },
    pendingText: {
      fontFamily: t.typography.fontFamily,
      fontSize: 8,
      color: t.colors.textOnPrimary,
      letterSpacing: 1,
    },
  });
}

export default PlantCard;
