/**
 * ============================================================================
 * ExploreScreen — Biblioteca de plantas (estilo inventario RPG)
 * ============================================================================
 *
 * Propósito:
 *   Pantalla para explorar la biblioteca de plantas. Usa PlantCard (igual
 *   que GardenHome) para uniformidad visual.
 *
 * Componentes DS: AppText, PlantCard, Input, Chip
 *
 * @see docs/DESIGN_SYSTEM_RETRO.md
 * ============================================================================
 */

import { AppText, Chip, Input, PlantCard } from '@/src/components/ui';
import { useAppTheme } from '@/src/theme/designSystem';
import React, { useState } from 'react';
import {
    FlatList,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Datos mock de plantas para la biblioteca
const plantLibrary = [
  {
    id: '1',
    name: 'Monstera Deliciosa',
    emoji: '🪴',
    scientific: 'Monstera deliciosa',
    difficulty: 'Fácil',
    light: '☀️ Luz indirecta',
    water: '💧 Cada 7 días',
    category: 'Interior',
  },
  {
    id: '2',
    name: 'Lavanda',
    emoji: '💜',
    scientific: 'Lavandula angustifolia',
    difficulty: 'Media',
    light: '☀️ Sol directo',
    water: '💧 Cada 10 días',
    category: 'Aromáticas',
  },
  {
    id: '3',
    name: 'Cactus San Pedro',
    emoji: '🌵',
    scientific: 'Echinopsis pachanoi',
    difficulty: 'Fácil',
    light: '☀️ Sol directo',
    water: '💧 Cada 15 días',
    category: 'Suculentas',
  },
  {
    id: '4',
    name: 'Pothos',
    emoji: '🌿',
    scientific: 'Epipremnum aureum',
    difficulty: 'Fácil',
    light: '☀️ Luz baja a indirecta',
    water: '💧 Cada 7-10 días',
    category: 'Interior',
  },
  {
    id: '5',
    name: 'Rosa',
    emoji: '🌹',
    scientific: 'Rosa spp.',
    difficulty: 'Difícil',
    light: '☀️ Sol directo (6h+)',
    water: '💧 Cada 2-3 días',
    category: 'Exterior',
  },
  {
    id: '6',
    name: 'Albahaca',
    emoji: '🌱',
    scientific: 'Ocimum basilicum',
    difficulty: 'Fácil',
    light: '☀️ Sol directo',
    water: '💧 Cada 2 días',
    category: 'Aromáticas',
  },
];

const DIFFICULTY_LEVEL: Record<string, string> = {
  'Fácil': '5',
  'Media': '15',
  'Difícil': '25',
};

const difficulties = ['Todas', 'Fácil', 'Media', 'Difícil'];

export default function ExploreScreen() {
  const theme = useAppTheme();
  const [search, setSearch] = useState('');
  const [activeDifficulty, setActiveDifficulty] = useState('Todas');

  const filteredPlants = plantLibrary.filter((plant) => {
    const matchesSearch =
      search === '' ||
      plant.name.toLowerCase().includes(search.toLowerCase()) ||
      plant.scientific.toLowerCase().includes(search.toLowerCase());
    const matchesDifficulty =
      activeDifficulty === 'Todas' || plant.difficulty === activeDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ────────────────────────────────────── */}
        <View style={[styles.header, { paddingHorizontal: theme.spacing.lg }]}>
          <AppText preset="title">📚 EXPLORAR</AppText>
          <AppText
            preset="bodySmall"
            color={theme.colors.textSecondary}
            style={{ marginTop: theme.spacing.xs }}
          >
            Biblioteca de plantas y sus cuidados
          </AppText>
        </View>

        {/* ── Buscador ──────────────────────────────────── */}
        <View style={{ paddingHorizontal: theme.spacing.lg, marginTop: theme.spacing.lg }}>
          <Input
            placeholder="Buscar planta por nombre..."
            value={search}
            onChangeText={setSearch}
            containerStyle={{ marginBottom: 0 }}
          />
        </View>

        {/* ── Filtros por dificultad ────────────────────── */}
        <View style={[styles.filterSection, { paddingLeft: theme.spacing.lg }]}>
          <AppText
            preset="caption"
            color={theme.colors.textSecondary}
            style={{ marginBottom: theme.spacing.sm, paddingRight: theme.spacing.lg }}
          >
            DIFICULTAD DE CUIDADO
          </AppText>
          <FlatList
            data={difficulties}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item}
            contentContainerStyle={{ gap: theme.spacing.sm }}
            renderItem={({ item }) => (
              <Chip
                label={item}
                active={activeDifficulty === item}
                onPress={() => setActiveDifficulty(item)}
              />
            )}
          />
        </View>

        {/* ── Lista de plantas (usa PlantCard igual que Jardín) ── */}
        <View style={{ paddingHorizontal: theme.spacing.lg, marginTop: theme.spacing.xl }}>
          <AppText preset="caption" color={theme.colors.textMuted} style={{ marginBottom: theme.spacing.md }}>
            {filteredPlants.length} planta{filteredPlants.length !== 1 ? 's' : ''} encontrada{filteredPlants.length !== 1 ? 's' : ''}
          </AppText>

          {filteredPlants.map((plant, index) => (
            <View key={plant.id} style={{ marginBottom: theme.spacing.md }}>
              <PlantCard
                name={plant.name}
                emoji={plant.emoji}
                description={`${plant.scientific}\n${plant.light}  ·  ${plant.water}`}
                level={DIFFICULTY_LEVEL[plant.difficulty] ?? '1'}
                onPress={() => {}}
                style={{ marginHorizontal: 0 }}
              />
            </View>
          ))}

          {filteredPlants.length === 0 && (
            <View style={styles.emptyState}>
              <AppText style={styles.emptyEmoji}>🔍</AppText>
              <AppText
                preset="body"
                color={theme.colors.textMuted}
                style={{ textAlign: 'center', marginTop: theme.spacing.sm }}
              >
                No se encontraron plantas con ese criterio
              </AppText>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  header: { paddingTop: 16, paddingBottom: 4 },
  filterSection: { marginTop: 20 },
  emptyState: { alignItems: 'center', paddingTop: 40 },
  emptyEmoji: { fontSize: 48 },
});
