/**
 * ============================================================================
 * PlantDetail — Ficha tecnica con estetica de dialogo RPG
 * ============================================================================
 *
 * Proposito:
 *   Pantalla de detalle de una planta con diseno inspirado en cuadros de
 *   dialogo de videojuegos retro 8-bit/16-bit. Muestra stats, descripcion
 *   y acciones dentro de "cajas de texto" con borde grueso.
 *   Carga datos reales de Firestore.
 *
 * @see src/screens/GardenHome/GardenHome.tsx
 * ============================================================================
 */

import { RetroButton } from '@/src/components/ui';
import { usePlantDetail } from '@/src/hooks/usePlantDetail';
import type { AppTheme } from '@/src/theme';
import { useAppTheme } from '@/src/theme/designSystem';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// ── Componente ────────────────────────────────────────────────────────────────

export default function PlantDetail() {
  const theme = useAppTheme();
  const s = getStyles(theme);
  const router = useRouter();
  const params = useLocalSearchParams<{
    id: string;
    name: string;
    iconName: string;
    description: string;
    level: string;
  }>();

  const { plant, isLoading, error } = usePlantDetail(params.id);

  if (isLoading) {
    return (
      <View style={[s.container, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // Usar datos de Firestore si disponibles, fallback a params
  const plantName = plant?.nickname ?? plant?.botanicalInfo?.commonName ?? params.name ?? 'Planta';
  const scientificName = plant?.botanicalInfo?.scientificName ?? '';
  const description = plant?.botanicalInfo?.origin
    ? `Origen: ${plant.botanicalInfo.origin}. Clima: ${plant.botanicalInfo.climate ?? 'N/A'}. Familia: ${plant.botanicalInfo.family ?? 'N/A'}.`
    : params.description ?? 'Informacion no disponible para esta especie.';

  // Stats de Firestore
  const waterLevel = plant?.status?.waterLevel ?? 50;
  const careStreak = plant?.status?.careStreak ?? 0;
  const healthMap: Record<string, number> = { excelente: 100, buena: 75, regular: 50, mala: 25 };
  const healthValue = healthMap[plant?.status?.health ?? 'buena'] ?? 50;
  const heightCm = plant?.status?.currentHeightCm ?? 0;

  // Tips generados de care rules
  const tips: string[] = [];
  if (plant?.careRules) {
    tips.push(`Regar cada ${plant.careRules.wateringFrequencyDays} dias`);
    if (plant.careRules.sunlight) tips.push(`Luz: ${plant.careRules.sunlight}`);
    if (plant.careRules.humidity) tips.push(`Humedad: ${plant.careRules.humidity}`);
    if (plant.careRules.soilType) tips.push(`Suelo: ${plant.careRules.soilType}`);
    if (plant.careRules.pruningSeason) tips.push(`Poda: ${plant.careRules.pruningSeason}`);
  }
  if (tips.length === 0) tips.push('Sin consejos disponibles');

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      {/* ── Boton Volver ──────────────────────── */}
      <RetroButton
        label="< Volver"
        variant="outlined"
        onPress={() => router.back()}
        style={s.backButton}
      />

      {/* -- Ficha principal (sprite box) -- */}
      <View style={s.spriteBox}>
        <View style={s.spriteIconSlot}>
          <MaterialCommunityIcons
            name={(params.iconName as keyof typeof MaterialCommunityIcons.glyphMap) ?? 'leaf'}
            size={36}
            color={theme.colors.primary}
          />
        </View>
        <View style={s.spriteInfo}>
          <Text style={s.spriteName}>{plantName}</Text>
          {scientificName ? (
            <Text style={s.spriteLevel}>{scientificName}</Text>
          ) : (
            <Text style={s.spriteLevel}>Lv. {params.level ?? '1'}</Text>
          )}
        </View>
      </View>

      {/* ── Caja de dialogo: Descripcion ──────── */}
      <View style={s.dialogueBox}>
        <Text style={s.dialogueLabel}>{'> DESCRIPCION'}</Text>
        <Text style={s.dialogueText}>{description}</Text>
        <Text style={s.cursor}>{'▼'}</Text>
      </View>

      {/* ── Stats Panel (barras tipo RPG) ─────── */}
      <View style={s.statsPanel}>
        <Text style={s.statsPanelTitle}>{'// STATS'}</Text>
        <StatBar label="AGUA" value={waterLevel} color={theme.colors.info} theme={theme} />
        <StatBar label="SALUD" value={healthValue} color={theme.colors.primary} theme={theme} />
        <StatBar label="RACHA" value={Math.min(careStreak * 10, 100)} color={theme.colors.warning} theme={theme} />
        <StatBar label="ALTO" value={Math.min(heightCm, 100)} color={theme.colors.secondary} theme={theme} />
      </View>

      {/* ── Consejos (estilo tierra/cafe) ──── */}
      <View style={s.consoleBox}>
        <Text style={s.consoleTitle}>{'CONSEJOS'}</Text>
        {tips.map((tip, i) => (
          <Text key={i} style={s.consoleLine}>
            {'•'} {tip}
          </Text>
        ))}
      </View>

      {/* ── Acciones ──────────────────────────── */}
      <View style={s.actions}>
        <RetroButton
          label="Editar"
          onPress={() => router.push({
            pathname: '/(app)/plant/edit/[id]',
            params: {
              id: params.id,
              defaultName: plantName,
              defaultSunlight: plant?.careRules?.sunlight ?? '',
              defaultWatering: String(plant?.careRules?.wateringFrequencyDays ?? 7),
            },
          } as any)}
          style={s.actionButton}
        />
        <RetroButton
          label="Volver"
          variant="outlined"
          onPress={() => router.back()}
          style={s.actionButton}
        />
      </View>

      {error && (
        <Text style={s.errorHint}>
          Datos de Firestore no disponibles. Mostrando datos basicos.
        </Text>
      )}
    </ScrollView>
  );
}

// ── Subcomponente: barra de stat RPG ──────────────────────────────────────────

function StatBar({
  label,
  value,
  color,
  theme,
}: {
  label: string;
  value: number;
  color: string;
  theme: AppTheme;
}) {
  const s = getStyles(theme);

  return (
    <View style={s.statRow}>
      <Text style={s.statLabel}>{label}</Text>
      <View style={s.statBarBg}>
        <View style={[s.statBarFill, { width: `${value}%`, backgroundColor: color }]} />
      </View>
      <Text style={s.statNum}>{value}</Text>
    </View>
  );
}

// ── Estilos ───────────────────────────────────────────────────────────────────

function getStyles(t: AppTheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: t.colors.background,
    },
    content: {
      padding: t.spacing.lg,
      paddingBottom: t.spacing['5xl'],
    },

    // ── Volver ───────────────────────────────────
    backButton: {
      alignSelf: 'flex-start',
      marginBottom: t.spacing.xl,
      minHeight: 40,
      paddingVertical: t.spacing.sm,
      paddingHorizontal: t.spacing.lg,
    },

    // ── Sprite Box (encabezado de la planta) ─────
    spriteBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: t.colors.surface,
      borderWidth: t.borderWidths.thick,
      borderColor: t.colors.border,
      borderRadius: t.radius.md,
      padding: t.spacing.lg,
      marginBottom: t.spacing.xl,
      gap: t.spacing.lg,
      ...t.elevation.md,
    },
    spriteIconSlot: {
      backgroundColor: t.colors.surfaceVariant,
      borderWidth: t.borderWidths.medium,
      borderColor: t.colors.border,
      borderRadius: t.radius.sm,
      width: 72,
      height: 72,
      alignItems: 'center',
      justifyContent: 'center',
    },
    spriteInfo: {
      flex: 1,
    },
    spriteName: {
      fontFamily: t.typography.fontFamily,
      fontSize: t.typography.sizes.title,
      color: t.colors.textPrimary,
      marginBottom: t.spacing.xs,
    },
    spriteLevel: {
      fontFamily: t.typography.fontFamilyMono,
      fontSize: t.typography.sizes.body,
      color: t.colors.secondary,
    },

    // ── Caja de dialogo RPG ──────────────────────
    dialogueBox: {
      backgroundColor: t.colors.surface,
      borderWidth: t.borderWidths.thick,
      borderColor: t.colors.textPrimary,
      borderRadius: t.radius.sm,
      padding: t.spacing.lg,
      marginBottom: t.spacing.xl,
    },
    dialogueLabel: {
      fontFamily: t.typography.fontFamily,
      fontSize: t.typography.sizes.caption,
      color: t.colors.primary,
      marginBottom: t.spacing.sm,
    },
    dialogueText: {
      fontFamily: t.typography.fontFamilyMono,
      fontSize: t.typography.sizes.body,
      color: t.colors.textPrimary,
      lineHeight: t.typography.sizes.body * t.typography.lineHeights.relaxed,
    },
    cursor: {
      fontFamily: t.typography.fontFamily,
      fontSize: t.typography.sizes.caption,
      color: t.colors.primary,
      textAlign: 'right',
      marginTop: t.spacing.sm,
    },

    // ── Panel de Stats ───────────────────────────
    statsPanel: {
      backgroundColor: t.colors.surface,
      borderWidth: t.borderWidths.thick,
      borderColor: t.colors.border,
      borderRadius: t.radius.md,
      padding: t.spacing.lg,
      marginBottom: t.spacing.xl,
      ...t.elevation.sm,
    },
    statsPanelTitle: {
      fontFamily: t.typography.fontFamily,
      fontSize: t.typography.sizes.caption,
      color: t.colors.textMuted,
      marginBottom: t.spacing.md,
    },
    statRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: t.spacing.sm,
      gap: t.spacing.sm,
    },
    statLabel: {
      fontFamily: t.typography.fontFamily,
      fontSize: t.typography.sizes.overline,
      color: t.colors.textSecondary,
      width: 48,
    },
    statBarBg: {
      flex: 1,
      height: 10,
      backgroundColor: t.colors.surfaceVariant,
      borderWidth: t.borderWidths.thin,
      borderColor: t.colors.border,
      borderRadius: 0,
      overflow: 'hidden',
    },
    statBarFill: {
      height: '100%',
      borderRadius: 0,
    },
    statNum: {
      fontFamily: t.typography.fontFamilyMono,
      fontSize: t.typography.sizes.caption,
      color: t.colors.textPrimary,
      width: 28,
      textAlign: 'right',
    },

    // ── Caja de consejos (estilo tierra/cafe) ────
    consoleBox: {
      backgroundColor: '#795548',
      borderWidth: t.borderWidths.thick,
      borderColor: '#4E342E',
      borderRadius: t.radius.md,
      padding: t.spacing.lg,
      marginBottom: t.spacing.xl,
      shadowColor: '#3E2723',
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 3,
    },
    consoleTitle: {
      fontFamily: t.typography.fontFamily,
      fontSize: t.typography.sizes.caption,
      color: '#FFF8E1',
      marginBottom: t.spacing.md,
    },
    consoleLine: {
      fontFamily: t.typography.fontFamilyMono,
      fontSize: t.typography.sizes.bodySmall,
      color: '#D7CCC8',
      lineHeight: t.typography.sizes.bodySmall * t.typography.lineHeights.relaxed,
      marginBottom: t.spacing.xs,
    },

    // ── Acciones ─────────────────────────────────
    actions: {
      flexDirection: 'row',
      gap: t.spacing.md,
    },
    actionButton: {
      flex: 1,
    },

    // ── Error hint ──────────────────────────────
    errorHint: {
      fontFamily: t.typography.fontFamilyMono,
      fontSize: t.typography.sizes.caption,
      color: t.colors.textMuted,
      textAlign: 'center',
      marginTop: t.spacing.md,
    },
  });
}
