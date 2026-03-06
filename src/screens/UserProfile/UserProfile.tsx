/**
 * ============================================================================
 * UserProfile — Pantalla de perfil estilo RPG / 2D pixel art
 * ============================================================================
 *
 * Propósito:
 *   Perfil de usuario con estética Retro Garden DS: bordes gruesos, sombra
 *   sólida, tipografía pixel y avatar interactivo que permite cargar foto
 *   desde galería/cámara con expo-image-picker.
 *
 * @see docs/DESIGN_SYSTEM_RETRO.md
 * ============================================================================
 */

import { RetroButton } from '@/src/components/ui';
import { useUserProfile } from '@/src/hooks/useUserProfile';
import type { AppTheme } from '@/src/theme';
import { useAppTheme } from '@/src/theme/designSystem';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// ── Sub-componentes internos ─────────────────────────────────

interface StatProps {
  value: number | string;
  label: string;
}

const StatItem: React.FC<StatProps> = ({ value, label }) => {
  const theme = useAppTheme();
  return (
    <View style={{ alignItems: 'center', flex: 1 }} accessibilityLabel={`${label}: ${value}`}>
      <Text style={{
        fontFamily: theme.typography.fontFamily,
        fontSize: theme.typography.sizes.body,
        color: theme.colors.primary,
      }}>{value}</Text>
      <Text style={{
        fontFamily: theme.typography.fontFamilyMono,
        fontSize: theme.typography.sizes.overline,
        color: theme.colors.textMuted,
        textTransform: 'uppercase',
        marginTop: 2,
      }}>{label}</Text>
    </View>
  );
};

interface CategoryChipProps {
  name: string;
  icon?: string;
}

const CategoryChip: React.FC<CategoryChipProps> = ({ name, icon }) => {
  const theme = useAppTheme();
  const CATEGORY_ICONS: Record<string, string> = {
    'Suculentas': '🌵',
    'Tropicales': '🌴',
    'Cactus': '🏜️',
    'Aromáticas': '🌿',
    'Helechos': '🌱',
    'Interior': '🏠',
    'Exterior': '☀️',
  };
  const emoji = icon ?? CATEGORY_ICONS[name] ?? '🌻';

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surfaceVariant,
        borderWidth: theme.borderWidths.medium,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.sm,
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        marginRight: theme.spacing.sm,
        gap: 4,
      }}
      accessibilityLabel={`Categoría: ${name}`}
    >
      <Text style={{ fontSize: 14 }}>{emoji}</Text>
      <Text style={{
        fontFamily: theme.typography.fontFamilyMono,
        fontSize: theme.typography.sizes.overline,
        color: theme.colors.textPrimary,
        textTransform: 'uppercase',
      }}>{name}</Text>
    </View>
  );
};

// ── Componente principal ─────────────────────────────────────

export default function UserProfile() {
  const { user, togglePrivacy } = useUserProfile();
  const theme = useAppTheme();
  const s = getStyles(theme);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const formattedBirthday = new Date(user.cumple).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
  });

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería para cambiar tu foto de perfil.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleEditProfile = () => {
    Alert.alert('Editar Perfil', 'Aquí iría la navegación a la pantalla de edición.');
  };

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={s.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header retro con "marco de carta RPG" ────── */}
      <View style={s.header}>
        <Text style={s.headerTitle}>⚔️ PERFIL DE JARDINERO</Text>

        {/* Avatar interactivo */}
        <TouchableOpacity
          onPress={handlePickImage}
          activeOpacity={0.8}
          accessibilityLabel="Cambiar foto de perfil"
          accessibilityRole="button"
        >
          <View style={s.avatarFrame}>
            <Image
              source={{ uri: avatarUri ?? user.imagen }}
              style={s.avatar}
              accessibilityLabel={`Foto de perfil de ${user.apodo}`}
            />
            {/* Badge de cámara pixel art */}
            <View style={s.cameraBadge}>
              <Text style={{ fontSize: 16 }}>📷</Text>
            </View>
          </View>
        </TouchableOpacity>

        <Text style={s.nickname}>{user.apodo}</Text>
        <Text style={s.fullName}>{user.nombre}</Text>
        <Text style={s.bio}>{user.descripcion}</Text>
      </View>

      {/* ── Stats bar RPG ────────────────────────────── */}
      <View style={s.statsBar}>
        <StatItem value={`🔥${user.racha}`} label="Racha" />
        <View style={s.statDivider} />
        <StatItem value={user.cantidadPlantas} label="Plantas" />
        <View style={s.statDivider} />
        <StatItem value={user.amigos} label="Amigos" />
      </View>

      {/* ── Categorías con iconos ────────────────────── */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>🌱 CATEGORIAS</Text>
        <FlatList
          data={user.categorias}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item }) => <CategoryChip name={item} />}
        />
      </View>

      {/* ── Planta favorita ──────────────────────────── */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>💚 PLANTA FAVORITA</Text>
        <View style={s.favCard}>
          <Text style={{ fontSize: 28, marginRight: theme.spacing.md }}>🪴</Text>
          <View style={{ flex: 1 }}>
            <Text style={s.favLabel}>Mi favorita</Text>
            <Text style={s.favName}>{user.plantaFavorita}</Text>
          </View>
        </View>
      </View>

      {/* ── Info adicional ───────────────────────────── */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>📋 INFO</Text>
        <View style={s.infoRow}>
          <Text style={{ fontSize: 16, marginRight: theme.spacing.sm }}>🎂</Text>
          <Text style={s.infoText}>{formattedBirthday}</Text>
        </View>
      </View>

      {/* ── Privacidad switch ────────────────────────── */}
      <View style={s.section}>
        <View style={s.privacyBox}>
          <View style={{ flex: 1 }}>
            <Text style={s.privacyLabel}>🔒 Perfil Privado</Text>
            <Text style={s.privacyHint}>
              {user.privacidad
                ? 'Solo tus amigos ven tu perfil'
                : 'Tu perfil es publico'}
            </Text>
          </View>
          <Switch
            value={user.privacidad}
            onValueChange={togglePrivacy}
            trackColor={{
              false: theme.colors.border,
              true: theme.colors.primarySoft,
            }}
            thumbColor={user.privacidad ? theme.colors.primary : theme.colors.white}
            accessibilityRole="switch"
            accessibilityLabel="Activar o desactivar perfil privado"
            accessibilityState={{ checked: user.privacidad }}
          />
        </View>
      </View>

      {/* ── Botón Editar Perfil ──────────────────────── */}
      <View style={{ marginTop: theme.spacing['2xl'], paddingHorizontal: theme.spacing.lg }}>
        <RetroButton label="EDITAR PERFIL" onPress={handleEditProfile} />
      </View>
    </ScrollView>
  );
}

// ── Estilos retro pixel art ───────────────────────────────────────────────────

function getStyles(t: AppTheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: t.colors.background,
    },
    scrollContent: {
      paddingBottom: t.spacing['5xl'],
    },

    // ── Header ───────────────────────────────────
    header: {
      alignItems: 'center',
      paddingTop: 50,
      paddingBottom: t.spacing['2xl'],
      paddingHorizontal: t.spacing.lg,
      backgroundColor: t.colors.surfaceVariant,
      borderBottomWidth: t.borderWidths.thick,
      borderBottomColor: t.colors.border,
    },
    headerTitle: {
      fontFamily: t.typography.fontFamily,
      fontSize: t.typography.sizes.caption,
      color: t.colors.secondary,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: t.spacing.lg,
    },

    // ── Avatar frame pixel art ───────────────────
    avatarFrame: {
      width: 100,
      height: 100,
      borderWidth: t.borderWidths.thick,
      borderColor: t.colors.border,
      borderRadius: t.radius.sm,
      backgroundColor: t.colors.surface,
      overflow: 'hidden',
      marginBottom: t.spacing.md,
      // Sombra sólida pixel art
      shadowColor: t.colors.shadow,
      shadowOffset: { width: 3, height: 3 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 4,
    },
    avatar: {
      width: '100%',
      height: '100%',
    },
    cameraBadge: {
      position: 'absolute',
      bottom: -2,
      right: -2,
      width: 28,
      height: 28,
      backgroundColor: t.colors.primary,
      borderWidth: t.borderWidths.medium,
      borderColor: t.colors.border,
      borderRadius: t.radius.sm,
      justifyContent: 'center',
      alignItems: 'center',
    },

    // ── Textos del header ────────────────────────
    nickname: {
      fontFamily: t.typography.fontFamily,
      fontSize: t.typography.sizes.subtitle,
      color: t.colors.primary,
    },
    fullName: {
      fontFamily: t.typography.fontFamilyMono,
      fontSize: t.typography.sizes.caption,
      color: t.colors.textSecondary,
      marginTop: 2,
    },
    bio: {
      fontFamily: t.typography.fontFamilyMono,
      fontSize: t.typography.sizes.caption,
      color: t.colors.textMuted,
      textAlign: 'center',
      marginTop: t.spacing.sm,
      paddingHorizontal: t.spacing.xl,
      lineHeight: t.typography.sizes.caption * t.typography.lineHeights.relaxed,
    },

    // ── Stats bar ────────────────────────────────
    statsBar: {
      flexDirection: 'row',
      backgroundColor: t.colors.surface,
      borderWidth: t.borderWidths.thick,
      borderColor: t.colors.border,
      borderRadius: t.radius.md,
      padding: t.spacing.md,
      marginHorizontal: t.spacing.lg,
      marginTop: -t.spacing.xl,
      justifyContent: 'space-around',
      alignItems: 'center',
      ...t.elevation.sm,
    },
    statDivider: {
      width: t.borderWidths.medium,
      height: 28,
      backgroundColor: t.colors.border,
    },

    // ── Secciones ────────────────────────────────
    section: {
      marginTop: t.spacing['2xl'],
      paddingHorizontal: t.spacing.lg,
    },
    sectionTitle: {
      fontFamily: t.typography.fontFamily,
      fontSize: t.typography.sizes.caption,
      color: t.colors.textPrimary,
      letterSpacing: 1,
      marginBottom: t.spacing.md,
    },

    // ── Planta favorita ──────────────────────────
    favCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: t.colors.surface,
      borderWidth: t.borderWidths.thick,
      borderColor: t.colors.border,
      borderRadius: t.radius.md,
      padding: t.spacing.lg,
      ...t.elevation.sm,
    },
    favLabel: {
      fontFamily: t.typography.fontFamilyMono,
      fontSize: t.typography.sizes.overline,
      color: t.colors.textMuted,
      textTransform: 'uppercase',
    },
    favName: {
      fontFamily: t.typography.fontFamily,
      fontSize: t.typography.sizes.body,
      color: t.colors.textPrimary,
      marginTop: 2,
    },

    // ── Info ─────────────────────────────────────
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: t.spacing.xs,
    },
    infoText: {
      fontFamily: t.typography.fontFamilyMono,
      fontSize: t.typography.sizes.caption,
      color: t.colors.textSecondary,
    },

    // ── Privacidad ───────────────────────────────
    privacyBox: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: t.colors.surface,
      borderWidth: t.borderWidths.thick,
      borderColor: t.colors.border,
      borderRadius: t.radius.md,
      padding: t.spacing.lg,
      ...t.elevation.sm,
    },
    privacyLabel: {
      fontFamily: t.typography.fontFamily,
      fontSize: t.typography.sizes.caption,
      color: t.colors.textPrimary,
    },
    privacyHint: {
      fontFamily: t.typography.fontFamilyMono,
      fontSize: t.typography.sizes.overline,
      color: t.colors.textMuted,
      marginTop: 2,
    },
  });
}
