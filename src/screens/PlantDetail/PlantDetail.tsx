/**
 * ============================================================================
 * PlantDetail — Ficha técnica con estética de diálogo RPG
 * ============================================================================
 *
 * Propósito:
 *   Pantalla de detalle de una planta con diseño inspirado en cuadros de
 *   diálogo de videojuegos retro 8-bit/16-bit. Muestra stats, descripción
 *   y acciones dentro de "cajas de texto" con borde grueso.
 *
 * Navegación:
 *   Recibe parámetros via Stack route params (id, name, emoji, etc.).
 *   Botón "Volver" regresa al GardenHome.
 *
 * Accesibilidad:
 *   - Headings semánticos
 *   - Botones con labels descriptivos
 *   - Contraste WCAG AA
 *
 * @see src/screens/GardenHome/GardenHome.tsx
 * ============================================================================
 */

import { RetroButton } from '@/src/components/ui';
import type { AppTheme } from '@/src/theme';
import { useAppTheme } from '@/src/theme/designSystem';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

// ── Datos de stats mock para cada planta ──────────────────────────────────────

interface PlantStats {
  water: number;     // 0-100
  sunlight: number;  // 0-100
  difficulty: number; // 0-100
  growth: number;    // 0-100
}

const PLANT_STATS: Record<string, PlantStats> = {
  '1': { water: 60, sunlight: 40, difficulty: 30, growth: 75 },
  '2': { water: 15, sunlight: 90, difficulty: 10, growth: 20 },
  '3': { water: 40, sunlight: 80, difficulty: 35, growth: 60 },
  '4': { water: 85, sunlight: 30, difficulty: 55, growth: 50 },
  '5': { water: 50, sunlight: 95, difficulty: 15, growth: 90 },
  '6': { water: 45, sunlight: 50, difficulty: 80, growth: 10 },
};

const PLANT_TIPS: Record<string, string[]> = {
  '1': ['Regar 2x por semana', 'Limpiar hojas con paño', 'Rotar cada 15 días'],
  '2': ['Regar 1x cada 2 semanas', 'Pleno sol directo', 'Sustrato drenante'],
  '3': ['Podar después de floración', 'Suelo calcáreo', 'Mucho sol'],
  '4': ['Mantener humedad alta', 'Sombra parcial', 'Nebulizar a diario'],
  '5': ['Regar a diario en verano', 'Sol directo 6h+', 'Tutor cuando crece'],
  '6': ['Podar ramas nuevas', 'Regar por inmersión', 'Luz indirecta brillante'],
};

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

  const stats = PLANT_STATS[params.id] ?? { water: 50, sunlight: 50, difficulty: 50, growth: 50 };
  const tips = PLANT_TIPS[params.id] ?? ['Sin consejos disponibles'];

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      {/* ── Botón Volver ──────────────────────── */}
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
            name={(params.iconName as any) ?? 'leaf'}
            size={36}
            color={theme.colors.primary}
          />
        </View>
        <View style={s.spriteInfo}>
          <Text style={s.spriteName}>{params.name ?? 'Planta'}</Text>
          <Text style={s.spriteLevel}>Lv. {params.level ?? '1'}</Text>
        </View>
      </View>

      {/* ── Caja de diálogo: Descripción ──────── */}
      <View style={s.dialogueBox}>
        <Text style={s.dialogueLabel}>{'> DESCRIPCION'}</Text>
        <Text style={s.dialogueText}>
          {params.description ?? 'Información no disponible para esta especie.'}
        </Text>
        {/* Cursor parpadeante decorativo */}
        <Text style={s.cursor}>▼</Text>
      </View>

      {/* ── Stats Panel (barras tipo RPG) ─────── */}
      <View style={s.statsPanel}>
        <Text style={s.statsPanelTitle}>{'// STATS'}</Text>
        <StatBar label="AGUA" value={stats.water} color={theme.colors.info} theme={theme} />
        <StatBar label="SOL" value={stats.sunlight} color={theme.colors.warning} theme={theme} />
        <StatBar label="DIFIC" value={stats.difficulty} color={theme.colors.error} theme={theme} />
        <StatBar label="CREC" value={stats.growth} color={theme.colors.primary} theme={theme} />
      </View>

      {/* ── Consejos (estilo tierra/café) ──── */}
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
          label="Regar"
          onPress={() => {}}
          style={s.actionButton}
        />
        <RetroButton
          label="Foto"
          variant="outlined"
          onPress={() => {}}
          style={s.actionButton}
        />
      </View>
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

    // ── Caja de diálogo RPG ──────────────────────
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

    // ── Caja de consejos (estilo tierra/café) ────
    consoleBox: {
      backgroundColor: '#795548',
      borderWidth: t.borderWidths.thick,
      borderColor: '#4E342E',
      borderRadius: t.radius.md,
      padding: t.spacing.lg,
      marginBottom: t.spacing.xl,
      // Sombra sólida marrón oscuro
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
  });
}
