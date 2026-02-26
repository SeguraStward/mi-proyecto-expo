import { PrimaryButton } from '@/src/components/ui/PrimaryButton';
import { PlantColors } from '@/src/constants/colors';
import { useUserProfile } from '@/src/hooks/useUserProfile';
import React from 'react';
import {
    Alert,
    FlatList,
    Image,
    ScrollView,
    Switch,
    Text,
    View,
} from 'react-native';
import { styles } from './UserProfile.styles';

// Los datos ahora vienen del custom hook useUserProfile

// ── Sub-componentes internos ─────────────────────────────────

interface StatProps {
  value: number | string;
  label: string;
}

const StatItem: React.FC<StatProps> = ({ value, label }) => (
  <View style={styles.statItem}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const StatDivider = () => <View style={styles.statDivider} />;

interface CategoryChipProps {
  name: string;
}

const CategoryChip: React.FC<CategoryChipProps> = ({ name }) => (
  <View style={styles.categoryChip}>
    <Text style={styles.categoryChipText}>{name}</Text>
  </View>
);

// ── Componente principal ─────────────────────────────────────

export default function UserProfile() {
  const { user, togglePrivacy } = useUserProfile();

  const formattedBirthday = new Date(user.cumple).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
  });

  const handleEditProfile = () => {
    Alert.alert('Editar Perfil', 'Aquí iría la navegación a la pantalla de edición.');
  };

  const handleTogglePrivacy = () => {
    togglePrivacy();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header ──────────────────────────────────────── */}
      <View style={styles.header}>
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: user.imagen }} style={styles.avatar} />
        </View>
        <Text style={styles.nickname}>{user.apodo}</Text>
        <Text style={styles.fullName}>{user.nombre}</Text>
        <Text style={styles.bio}>{user.descripcion}</Text>
      </View>

      {/* ── Stats Card ──────────────────────────────────── */}
      <View style={styles.statsCard}>
        <StatItem value={`🔥 ${user.racha}`} label="Racha de riego" />
        <StatDivider />
        <StatItem value={user.cantidadPlantas} label="Plantas" />
        <StatDivider />
        <StatItem value={user.amigos} label="Amigos" />
      </View>

      {/* ── Categorías de plantas ───────────────────────── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🌱 Categorías de Plantas</Text>
        <FlatList
          data={user.categorias}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item }) => <CategoryChip name={item} />}
        />
      </View>

      {/* ── Planta favorita ─────────────────────────────── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💚 Planta Favorita</Text>
        <View style={styles.favoritePlantCard}>
          <Text style={styles.favoritePlantEmoji}>🪴</Text>
          <View>
            <Text style={styles.favoritePlantLabel}>Mi favorita</Text>
            <Text style={styles.favoritePlantName}>{user.plantaFavorita}</Text>
          </View>
        </View>
      </View>

      {/* ── Info adicional ──────────────────────────────── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📋 Información</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoEmoji}>🎂</Text>
          <Text style={styles.infoText}>{formattedBirthday}</Text>
        </View>
      </View>

      {/* ── Privacidad (Switch) ─────────────────────────── */}
      <View style={styles.section}>
        <View style={styles.privacyRow}>
          <View>
            <Text style={styles.privacyLabel}>Perfil Privado</Text>
            <Text style={styles.privacyHint}>
              {user.privacidad
                ? 'Solo tus amigos pueden ver tu perfil'
                : 'Tu perfil es visible para todos'}
            </Text>
          </View>
          <Switch
            value={user.privacidad}
            onValueChange={handleTogglePrivacy}
            trackColor={{
              false: PlantColors.border,
              true: PlantColors.primarySoft,
            }}
            thumbColor={user.privacidad ? PlantColors.primary : PlantColors.white}
          />
        </View>
      </View>

      {/* ── Botón Editar Perfil ─────────────────────────── */}
      <View style={styles.editButtonWrapper}>
        <PrimaryButton title="Editar Perfil" onPress={handleEditProfile} />
      </View>
    </ScrollView>
  );
}
