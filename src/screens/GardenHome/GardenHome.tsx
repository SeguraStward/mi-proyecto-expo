/**
 * ============================================================================
 * GardenHome — Pantalla principal "Mi Jardin" estilo inventario RPG
 * ============================================================================
 *
 * Carga plantas reales del usuario desde Firestore.
 * Permite navegar al detalle y crear nuevas plantas.
 * ============================================================================
 */

import { PlantCard, RetroButton } from '@/src/components/ui';
import { useGardenPlants } from '@/src/hooks/useGardenPlants';
import type { AppTheme } from '@/src/theme';
import { useAppTheme } from '@/src/theme/designSystem';
import type { PlantDocument } from '@/src/types-dtos/plant.types';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// ── Componente ────────────────────────────────────────────────────────────────

export default function GardenHome() {
  const theme = useAppTheme();
  const s = getStyles(theme);
  const router = useRouter();
  const { plants, isLoading, error, refetch } = useGardenPlants();

  const handlePlantPress = (plant: PlantDocument) => {
    router.push({
      pathname: '/(app)/plant/[id]',
      params: {
        id: plant.id,
        name: plant.nickname ?? plant.botanicalInfo?.commonName ?? 'Planta',
        iconName: 'leaf',
        description: plant.botanicalInfo?.origin
          ? `${plant.botanicalInfo.commonName}. Origen: ${plant.botanicalInfo.origin}.`
          : plant.botanicalInfo?.commonName ?? '',
        level: String(plant.status?.careStreak ?? 1),
      },
    } as any);
  };

  const renderHeader = () => (
    <View style={s.header}>
      <Text style={s.title}>MI JARDIN</Text>
      <Text style={s.subtitle}>Inventario de plantas</Text>

      <View style={s.statsBar}>
        <View style={s.statItem}>
          <Text style={s.statValue}>{plants.length}</Text>
          <Text style={s.statLabel}>Plantas</Text>
        </View>
        <View style={s.statDivider} />
        <View style={s.statItem}>
          <Text style={s.statValue}>
            {plants.filter((p) => (p.status?.waterLevel ?? 100) < 30).length}
          </Text>
          <Text style={s.statLabel}>Necesitan agua</Text>
        </View>
        <View style={s.statDivider} />
        <View style={s.statItem}>
          <Text style={s.statValue}>
            {Math.max(...plants.map((p) => p.status?.careStreak ?? 0), 0)}
          </Text>
          <Text style={s.statLabel}>Racha max</Text>
        </View>
      </View>

      <RetroButton
        label="+ Nueva Planta"
        onPress={() => router.push('/(app)/plant/new')}
        style={s.ctaButton}
      />
    </View>
  );

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View style={s.empty}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[s.emptyHint, { marginTop: theme.spacing.lg }]}>Cargando jardin...</Text>
        </View>
      );
    }
    if (error) {
      return (
        <View style={s.empty}>
          <MaterialCommunityIcons name="alert-circle-outline" size={48} color={theme.colors.error} style={{ marginBottom: theme.spacing.lg }} />
          <Text style={[s.emptyText, { color: theme.colors.error }]}>Error al cargar</Text>
          <Pressable onPress={refetch} style={s.retryBtn} accessibilityRole="button">
            <Text style={s.retryText}>REINTENTAR</Text>
          </Pressable>
        </View>
      );
    }
    return (
      <View style={s.empty}>
        <MaterialCommunityIcons name="sprout" size={48} color={theme.colors.textMuted} style={{ marginBottom: theme.spacing.lg }} />
        <Text style={s.emptyText}>Tu jardin esta vacio</Text>
        <Text style={s.emptyHint}>Presiona "+ Nueva Planta" para comenzar</Text>
      </View>
    );
  };

  return (
    <View style={s.container}>
      <FlatList
        data={plants}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={plants.length > 0 ? s.gridRow : undefined}
        renderItem={({ item }) => (
          <PlantCard
            name={item.nickname ?? item.botanicalInfo?.commonName ?? 'Planta'}
            iconName="leaf"
            scientificName={item.botanicalInfo?.scientificName ?? item.botanicalInfo?.commonName ?? ''}
            imageUri={item.photos?.[0]?.url}
            onPress={() => handlePlantPress(item)}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}
        accessibilityRole="list"
        onRefresh={refetch}
        refreshing={isLoading}
      />
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
    listContent: {
      padding: t.spacing.lg,
      paddingBottom: t.spacing['5xl'],
    },
    header: {
      marginBottom: t.spacing['2xl'],
    },
    title: {
      fontFamily: t.typography.fontFamily,
      fontSize: t.typography.sizes.title,
      color: t.colors.textPrimary,
      textAlign: 'center',
      marginBottom: t.spacing.xs,
    },
    subtitle: {
      fontFamily: t.typography.fontFamilyMono,
      fontSize: t.typography.sizes.caption,
      color: t.colors.textSecondary,
      textAlign: 'center',
      marginBottom: t.spacing.xl,
    },
    statsBar: {
      flexDirection: 'row',
      backgroundColor: t.colors.surface,
      borderWidth: t.borderWidths.thick,
      borderColor: t.colors.border,
      borderRadius: t.radius.md,
      padding: t.spacing.md,
      marginBottom: t.spacing.xl,
      justifyContent: 'space-around',
      alignItems: 'center',
      ...t.elevation.sm,
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      fontFamily: t.typography.fontFamily,
      fontSize: t.typography.sizes.body,
      color: t.colors.primary,
      marginBottom: 2,
    },
    statLabel: {
      fontFamily: t.typography.fontFamilyMono,
      fontSize: t.typography.sizes.overline,
      color: t.colors.textMuted,
      textTransform: 'uppercase',
    },
    statDivider: {
      width: t.borderWidths.medium,
      height: 28,
      backgroundColor: t.colors.border,
    },
    ctaButton: {
      marginBottom: t.spacing.sm,
    },
    gridRow: {
      gap: t.spacing.md,
      marginBottom: t.spacing.md,
    },
    empty: {
      alignItems: 'center',
      paddingVertical: t.spacing['5xl'],
    },
    emptyText: {
      fontFamily: t.typography.fontFamily,
      fontSize: t.typography.sizes.subtitle,
      color: t.colors.textPrimary,
      marginBottom: t.spacing.sm,
    },
    emptyHint: {
      fontFamily: t.typography.fontFamilyMono,
      fontSize: t.typography.sizes.caption,
      color: t.colors.textMuted,
      textAlign: 'center',
    },
    retryBtn: {
      marginTop: t.spacing.lg,
      paddingHorizontal: t.spacing.xl,
      paddingVertical: t.spacing.md,
      borderWidth: t.borderWidths.thick,
      borderColor: t.colors.error,
      borderRadius: t.radius.md,
    },
    retryText: {
      fontFamily: t.typography.fontFamily,
      fontSize: t.typography.sizes.overline,
      color: t.colors.error,
      letterSpacing: 1,
    },
  });
}
