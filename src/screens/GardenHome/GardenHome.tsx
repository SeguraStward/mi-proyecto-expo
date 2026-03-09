/**
 * ============================================================================
 * GardenHome — Pantalla principal "Mi Jardín" estilo inventario RPG
 * ============================================================================
 *
 * Propósito:
 *   Lista de plantas del usuario presentada como inventario de un RPG retro.
 *   Utiliza PlantCard para cada item, con header pixel-art y botón CTA.
 *
 * Navegación:
 *   Presionar una PlantCard navega a PlantDetail con Stack.
 *
 * Accesibilidad:
 *   - FlatList con accessibilityRole="list"
 *   - Cada item con role="button" para navegación
 *
 * @see src/components/ui/PlantCard.tsx
 * @see src/screens/PlantDetail/PlantDetail.tsx
 * ============================================================================
 */

import { PlantCard, RetroButton } from '@/src/components/ui';
import type { AppTheme } from '@/src/theme';
import { useAppTheme } from '@/src/theme/designSystem';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    View,
} from 'react-native';

// ── Datos mock de plantas (inventario RPG) ────────────────────────────────────

interface PlantItem {
  id: string;
  name: string;
  iconName: string;
  scientificName: string;
  imageUri: string;
  description: string;
  level: string;
}

const MOCK_PLANTS: PlantItem[] = [
  {
    id: '1',
    name: 'Monstera',
    iconName: 'leaf',
    scientificName: 'Monstera deliciosa',
    imageUri: 'https://picsum.photos/seed/monstera/200/300',
    description: 'Planta tropical de hojas fenestradas. Resistente a sombra parcial.',
    level: '12',
  },
  {
    id: '2',
    name: 'Cactus Barril',
    iconName: 'cactus',
    scientificName: 'Echinocactus grusonii',
    imageUri: 'https://picsum.photos/seed/cactus-barrel/200/300',
    description: 'Suculenta esferica del desierto. Casi indestructible.',
    level: '8',
  },
  {
    id: '3',
    name: 'Lavanda',
    iconName: 'flower',
    scientificName: 'Lavandula angustifolia',
    imageUri: 'https://picsum.photos/seed/lavender/200/300',
    description: 'Aromatica mediterranea. Atrae polinizadores y repele plagas.',
    level: '15',
  },
  {
    id: '4',
    name: 'Helecho Real',
    iconName: 'sprout',
    scientificName: 'Osmunda regalis',
    imageUri: 'https://picsum.photos/seed/fern-royal/200/300',
    description: 'Helecho antiguo de frondas elegantes. Necesita humedad alta.',
    level: '20',
  },
  {
    id: '5',
    name: 'Girasol',
    iconName: 'white-balance-sunny',
    scientificName: 'Helianthus annuus',
    imageUri: 'https://picsum.photos/seed/sunflower/200/300',
    description: 'Heliotropa anual. Sigue la direccion del sol durante el dia.',
    level: '5',
  },
  {
    id: '6',
    name: 'Bonsai Ficus',
    iconName: 'tree',
    scientificName: 'Ficus retusa',
    imageUri: 'https://picsum.photos/seed/bonsai-ficus/200/300',
    description: 'Miniatura viva. Requiere poda y paciencia de nivel experto.',
    level: '30',
  },
];

// ── Datos mock de consejos de jardinería ──────────────────────────────────────

interface TipItem {
  id: string;
  iconName: string;
  title: string;
  body: string;
}

const GARDEN_TIPS: TipItem[] = [
  {
    id: 't1',
    iconName: 'water-outline',
    title: 'Riego matutino',
    body: 'Riega tus plantas al amanecer para evitar la evaporacion rapida.',
  },
  {
    id: 't2',
    iconName: 'sprout-outline',
    title: 'Tierra nutritiva',
    body: 'Agrega compost casero cada 2 semanas para mantener nutrientes.',
  },
  {
    id: 't3',
    iconName: 'white-balance-sunny',
    title: 'Luz adecuada',
    body: 'Asegurate de que cada planta tenga la luz que necesita segun su tipo.',
  },
  {
    id: 't4',
    iconName: 'flower-tulip-outline',
    title: 'Trasplante',
    body: 'Si las raices salen por los agujeros, es hora de una maceta mas grande.',
  },
];

// ── Componente ────────────────────────────────────────────────────────────────

export default function GardenHome() {
  const theme = useAppTheme();
  const s = getStyles(theme);
  const router = useRouter();

  const handlePlantPress = (plant: PlantItem) => {
    router.push({
      pathname: '/(app)/plant/[id]' as any,
      params: {
        id: plant.id,
        name: plant.name,
        iconName: plant.iconName,
        description: plant.description,
        level: plant.level,
      },
    });
  };

  const renderHeader = () => (
    <View style={s.header}>
      {/* Titulo pixel art */}
      <Text style={s.title}>MI JARDIN</Text>
      <Text style={s.subtitle}>Inventario de plantas</Text>

      {/* Stats bar estilo RPG */}
      <View style={s.statsBar}>
        <View style={s.statItem}>
          <Text style={s.statValue}>{MOCK_PLANTS.length}</Text>
          <Text style={s.statLabel}>Plantas</Text>
        </View>
        <View style={s.statDivider} />
        <View style={s.statItem}>
          <Text style={s.statValue}>3</Text>
          <Text style={s.statLabel}>Raras</Text>
        </View>
        <View style={s.statDivider} />
        <View style={s.statItem}>
          <Text style={s.statValue}>Lv.12</Text>
          <Text style={s.statLabel}>Jardinero</Text>
        </View>
      </View>

      {/* CTA */}
      <RetroButton
        label="+ Nueva Planta"
        onPress={() => {}}
        style={s.ctaButton}
      />
    </View>
  );

  const renderEmpty = () => (
    <View style={s.empty}>
      <MaterialCommunityIcons
        name="sprout"
        size={48}
        color={theme.colors.textMuted}
        style={{ marginBottom: theme.spacing.lg }}
      />
      <Text style={s.emptyText}>Tu jardin esta vacio</Text>
      <Text style={s.emptyHint}>Anade tu primera planta</Text>
    </View>
  );

  const renderTipsFooter = () => (
    <View style={s.tipsSection}>
      {/* Franja superior de tierra */}
      <View style={s.soilStripe} />

      <View style={s.tipsContainer}>
        <Text style={s.tipsTitle}>CONSEJOS DE JARDINERO</Text>
        <Text style={s.tipsSubtitle}>Tips del dia para cuidar tu jardin</Text>

        {GARDEN_TIPS.map((tip) => (
          <View key={tip.id} style={s.tipCard}>
            <View style={s.tipIconWrapper}>
              <MaterialCommunityIcons name={tip.iconName as any} size={20} color="#FFF8E1" />
            </View>
            <View style={s.tipContent}>
              <Text style={s.tipTitle}>{tip.title}</Text>
              <Text style={s.tipBody}>{tip.body}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Franja inferior de tierra (raíces decorativas) */}
      <View style={s.soilStripeBottom}>
        <Text style={s.rootsText}>~∿~∿~∿~∿~∿~∿~∿~∿~∿~∿~∿~∿~</Text>
      </View>
    </View>
  );

  return (
    <View style={s.container}>
      <FlatList
        data={MOCK_PLANTS}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={s.gridRow}
        renderItem={({ item }) => (
          <PlantCard
            name={item.name}
            iconName={item.iconName}
            scientificName={item.scientificName}
            imageUri={item.imageUri}
            onPress={() => handlePlantPress(item)}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderTipsFooter}
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}
        accessibilityRole="list"
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

    // ── Header ───────────────────────────────────
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

    // ── Stats bar RPG ────────────────────────────
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

    // ── CTA ──────────────────────────────────────
    ctaButton: {
      marginBottom: t.spacing.sm,
    },

    // ── Lista ────────────────────────────────────
    gridRow: {
      gap: t.spacing.md,
      marginBottom: t.spacing.md,
    },

    // ── Empty state ──────────────────────────────
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
    },

    // ── Sección de consejos (tierra/café) ────────
    tipsSection: {
      marginTop: t.spacing['3xl'],
    },
    soilStripe: {
      height: 8,
      backgroundColor: '#5D4037',
      borderTopWidth: t.borderWidths.medium,
      borderTopColor: '#3E2723',
    },
    tipsContainer: {
      backgroundColor: '#795548',
      paddingVertical: t.spacing.xl,
      paddingHorizontal: t.spacing.lg,
    },
    tipsTitle: {
      fontFamily: t.typography.fontFamily,
      fontSize: t.typography.sizes.subtitle,
      color: '#FFF8E1',
      textAlign: 'center',
      marginBottom: t.spacing.xs,
    },
    tipsSubtitle: {
      fontFamily: t.typography.fontFamilyMono,
      fontSize: t.typography.sizes.overline,
      color: '#D7CCC8',
      textAlign: 'center',
      marginBottom: t.spacing.xl,
      textTransform: 'uppercase',
    },
    tipCard: {
      flexDirection: 'row',
      backgroundColor: '#6D4C41',
      borderWidth: t.borderWidths.medium,
      borderColor: '#4E342E',
      borderRadius: t.radius.md,
      padding: t.spacing.md,
      marginBottom: t.spacing.md,
      // Sombra sólida pixel art (marrón oscuro)
      shadowColor: '#3E2723',
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 3,
    },
    tipIconWrapper: {
      width: 40,
      height: 40,
      backgroundColor: '#8D6E63',
      borderWidth: t.borderWidths.thin,
      borderColor: '#4E342E',
      borderRadius: t.radius.sm,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: t.spacing.md,
    },
    tipContent: {
      flex: 1,
    },
    tipTitle: {
      fontFamily: t.typography.fontFamily,
      fontSize: t.typography.sizes.caption,
      color: '#FFF8E1',
      marginBottom: 2,
    },
    tipBody: {
      fontFamily: t.typography.fontFamilyMono,
      fontSize: t.typography.sizes.overline,
      color: '#D7CCC8',
      lineHeight: t.typography.sizes.overline * t.typography.lineHeights.relaxed,
    },
    soilStripeBottom: {
      height: 16,
      backgroundColor: '#4E342E',
      borderTopWidth: t.borderWidths.medium,
      borderTopColor: '#3E2723',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    rootsText: {
      fontFamily: t.typography.fontFamilyMono,
      fontSize: 10,
      color: '#6D4C41',
    },
  });
}
