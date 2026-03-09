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
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
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
    iconName: 'leaf',
    scientific: 'Monstera deliciosa',
    imageUri: 'https://picsum.photos/seed/monstera-lib/200/300',
    difficulty: 'Facil',
    light: 'Luz indirecta',
    water: 'Cada 7 dias',
    category: 'Interior',
  },
  {
    id: '2',
    name: 'Lavanda',
    iconName: 'flower',
    scientific: 'Lavandula angustifolia',
    imageUri: 'https://picsum.photos/seed/lavender-lib/200/300',
    difficulty: 'Media',
    light: 'Sol directo',
    water: 'Cada 10 dias',
    category: 'Aromaticas',
  },
  {
    id: '3',
    name: 'Cactus San Pedro',
    iconName: 'cactus',
    scientific: 'Echinopsis pachanoi',
    imageUri: 'https://picsum.photos/seed/cactus-lib/200/300',
    difficulty: 'Facil',
    light: 'Sol directo',
    water: 'Cada 15 dias',
    category: 'Suculentas',
  },
  {
    id: '4',
    name: 'Pothos',
    iconName: 'leaf',
    scientific: 'Epipremnum aureum',
    imageUri: 'https://picsum.photos/seed/pothos/200/300',
    difficulty: 'Facil',
    light: 'Luz baja a indirecta',
    water: 'Cada 7-10 dias',
    category: 'Interior',
  },
  {
    id: '5',
    name: 'Rosa',
    iconName: 'flower-tulip',
    scientific: 'Rosa spp.',
    imageUri: 'https://picsum.photos/seed/rose-garden/200/300',
    difficulty: 'Dificil',
    light: 'Sol directo (6h+)',
    water: 'Cada 2-3 dias',
    category: 'Exterior',
  },
  {
    id: '6',
    name: 'Albahaca',
    iconName: 'sprout',
    scientific: 'Ocimum basilicum',
    imageUri: 'https://picsum.photos/seed/basil-herb/200/300',
    difficulty: 'Facil',
    light: 'Sol directo',
    water: 'Cada 2 dias',
    category: 'Aromaticas',
  },
];

const difficulties = ['Todas', 'Facil', 'Media', 'Dificil'];

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
          <AppText preset="title">EXPLORAR</AppText>
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

        {/* ── Grid de plantas (2 columnas estilo PictureThis) ── */}
        <View style={{ paddingHorizontal: theme.spacing.lg, marginTop: theme.spacing.xl }}>
          <AppText preset="caption" color={theme.colors.textMuted} style={{ marginBottom: theme.spacing.md }}>
            {filteredPlants.length} planta{filteredPlants.length !== 1 ? 's' : ''} encontrada{filteredPlants.length !== 1 ? 's' : ''}
          </AppText>

          <View style={styles.grid}>
            {filteredPlants.map((plant) => (
              <View key={plant.id} style={styles.gridItem}>
                <PlantCard
                  name={plant.name}
                  iconName={plant.iconName}
                  scientificName={plant.scientific}
                  imageUri={plant.imageUri}
                  onPress={() => {}}
                />
              </View>
            ))}
          </View>

          {filteredPlants.length === 0 && (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="magnify"
                size={48}
                color={theme.colors.textMuted}
              />
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
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gridItem: { width: '48%' },
  emptyState: { alignItems: 'center', paddingTop: 40 },
});
