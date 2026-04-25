/**
 * ============================================================================
 * UserProfile — Pantalla de perfil
 * ============================================================================
 *
 * Proposito:
 *   Perfil de usuario con cards limpias y toggle compacto de solo iconos.
 *   Seccion Info: stats, bio, boton editar.
 *   Seccion Config: toggles de tema y privacidad.
 *
 * @see docs/DESIGN_SYSTEM_RETRO.md
 * ============================================================================
 */

import { useAuth } from '@/src/context/AuthContext';
import { useThemeToggle } from '@/src/context/ThemeContext';
import { useToast } from '@/src/context/ToastContext';
import { useUserProfile } from '@/src/hooks/useUserProfile';
import { updateUser, uploadUserAvatar } from '@/src/services/firestore';
import type { AppTheme } from '@/src/theme';
import { useAppTheme } from '@/src/theme/designSystem';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// ── Constantes ───────────────────────────────────────────────

type ProfileTab = 'info' | 'settings';

// ── Componente principal ─────────────────────────────────────

export default function UserProfile() {
  const { userDoc, isLoading, error } = useUserProfile();
  const { user } = useAuth();
  const { showToast } = useToast();
  const theme = useAppTheme();
  const { mode, toggleTheme } = useThemeToggle();
  const router = useRouter();
  const s = getStyles(theme);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ProfileTab>('info');

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galeria para cambiar tu foto de perfil.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setAvatarUri(uri);

      if (!user?.uid) {
        showToast({ type: 'error', message: 'Sesion no valida para subir avatar' });
        return;
      }

      try {
        const avatarUrl = await uploadUserAvatar(user.uid, uri);
        await updateUser(user.uid, {
          profile: {
            bio: userDoc?.profile?.bio ?? '',
            avatarUrl,
          },
        });
        showToast({ type: 'success', message: 'Foto de perfil actualizada' });
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'No se pudo subir la foto de perfil';
        showToast({ type: 'error', message: msg });
      }
    }
  };

  if (isLoading) {
    return (
      <View style={[s.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error || !userDoc) {
    return (
      <View style={[s.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={s.errorText}>{error ?? 'No se pudo cargar el perfil'}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={s.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header: avatar + nombre + toggle ─────── */}
      <View style={s.header}>
        {/* Avatar interactivo */}
        <TouchableOpacity
          onPress={handlePickImage}
          activeOpacity={0.8}
          accessibilityLabel="Cambiar foto de perfil"
          accessibilityRole="button"
        >
          <View style={s.avatarFrame}>
            <Image
              source={{ uri: avatarUri ?? userDoc.profile?.avatarUrl ?? 'https://i.pravatar.cc/300' }}
              style={s.avatar}
              accessibilityLabel={`Foto de perfil de ${userDoc.username}`}
            />
            <View style={s.cameraBadge}>
              <MaterialCommunityIcons name="camera" size={14} color={theme.colors.textOnPrimary} />
            </View>
          </View>
        </TouchableOpacity>

        <Text style={s.displayName}>{userDoc.displayName}</Text>
        <Text style={s.handle}>@{userDoc.username}</Text>

        {/* ── Toggle compacto de solo iconos ──────── */}
        <View style={s.togglePill}>
          <Pressable
            onPress={() => setActiveTab('info')}
            style={[s.toggleBtn, activeTab === 'info' && s.toggleBtnActive]}
            accessibilityRole="tab"
            accessibilityLabel="Info del explorador"
            accessibilityState={{ selected: activeTab === 'info' }}
          >
            <MaterialCommunityIcons
              name="account-outline"
              size={18}
              color={activeTab === 'info' ? theme.colors.textOnPrimary : theme.colors.textSecondary}
            />
          </Pressable>
          <Pressable
            onPress={() => setActiveTab('settings')}
            style={[s.toggleBtn, activeTab === 'settings' && s.toggleBtnActive]}
            accessibilityRole="tab"
            accessibilityLabel="Configuracion"
            accessibilityState={{ selected: activeTab === 'settings' }}
          >
            <MaterialCommunityIcons
              name="cog-outline"
              size={18}
              color={activeTab === 'settings' ? theme.colors.textOnPrimary : theme.colors.textSecondary}
            />
          </Pressable>
        </View>
      </View>

      {/* ── Contenido segun tab activo ────────────── */}
      {activeTab === 'info' ? (
        /* ── INFO DEL EXPLORADOR ── */
        <View style={s.infoContainer}>
          {/* Stats del jardin */}
          <View style={s.statsGrid}>
            <View style={s.statCard}>
              <MaterialCommunityIcons name="star" size={20} color={theme.colors.secondary} />
              <Text style={s.statValue}>Lv. {userDoc.gamification?.level ?? 1}</Text>
              <Text style={s.statLabel}>{userDoc.gamification?.levelName ?? 'Semilla'}</Text>
            </View>
            <View style={s.statCard}>
              <MaterialCommunityIcons name="fire" size={20} color={theme.colors.secondary} />
              <Text style={s.statValue}>{userDoc.gamification?.dailyStreak ?? 0}</Text>
              <Text style={s.statLabel}>Racha</Text>
            </View>
            <View style={s.statCard}>
              <MaterialCommunityIcons name="account-group" size={20} color={theme.colors.primary} />
              <Text style={s.statValue}>{userDoc.social?.enraizados?.length ?? 0}</Text>
              <Text style={s.statLabel}>Amigos</Text>
            </View>
          </View>

          {/* Bio */}
          <View style={s.card}>
            <Text style={s.cardTitle}>SOBRE MI</Text>
            <Text style={s.cardBody}>
              {userDoc.profile?.bio || 'Sin descripcion aun.'}
            </Text>
          </View>

          {/* Informacion de contacto */}
          <View style={s.card}>
            <Text style={s.cardTitle}>CONTACTO</Text>
            <View style={s.infoRow}>
              <MaterialCommunityIcons name="instagram" size={16} color={theme.colors.secondary} />
              <Text style={s.infoValue}>
                {userDoc.contactInfo?.instagram ? `@${userDoc.contactInfo.instagram}` : '—'}
              </Text>
            </View>
            <View style={s.infoDivider} />
            <View style={s.infoRow}>
              <MaterialCommunityIcons name="whatsapp" size={16} color={theme.colors.secondary} />
              <Text style={s.infoValue}>
                {userDoc.contactInfo?.whatsapp || '—'}
              </Text>
            </View>
            <View style={s.infoDivider} />
            <View style={s.infoRow}>
              <MaterialCommunityIcons name="account-circle-outline" size={16} color={theme.colors.secondary} />
              <Text style={s.infoValue} numberOfLines={1}>
                @{userDoc.username || '—'}
              </Text>
            </View>
          </View>

          {/* Ubicacion */}
          <View style={s.card}>
            <Text style={s.cardTitle}>UBICACION</Text>
            <View style={s.infoRow}>
              <MaterialCommunityIcons name="map-marker-outline" size={16} color={theme.colors.secondary} />
              <Text style={s.infoValue}>{userDoc.location?.province || '—'}</Text>
            </View>
            <View style={s.infoDivider} />
            <View style={s.infoRow}>
              <MaterialCommunityIcons name="earth" size={16} color={theme.colors.secondary} />
              <Text style={s.infoValue}>{userDoc.location?.country || '—'}</Text>
            </View>
          </View>

          {/* Boton editar perfil */}
          <Pressable
            style={s.editBtn}
            onPress={() => router.push('/(app)/profile/edit')}
            accessibilityRole="button"
            accessibilityLabel="Editar perfil"
          >
            <MaterialCommunityIcons name="pencil" size={16} color={theme.colors.textOnPrimary} />
            <Text style={s.editBtnText}>EDITAR PERFIL</Text>
          </Pressable>
        </View>
      ) : (
        /* ── CONFIGURACION ── */
        <View style={s.settingsContainer}>
          {/* Toggle tema */}
          <View style={s.settingRow}>
            <View style={s.settingInfo}>
              <MaterialCommunityIcons
                name={mode === 'dark' ? 'weather-night' : 'white-balance-sunny'}
                size={18}
                color={theme.colors.textSecondary}
              />
              <View style={s.settingTexts}>
                <Text style={s.settingLabel}>
                  Tema {mode === 'dark' ? 'Oscuro' : 'Claro'}
                </Text>
                <Text style={s.settingHint}>
                  {mode === 'dark' ? 'Jardin de noche' : 'Jardin de dia'}
                </Text>
              </View>
            </View>
            <Switch
              value={mode === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primarySoft,
              }}
              thumbColor={mode === 'dark' ? theme.colors.primary : theme.colors.white}
              accessibilityRole="switch"
              accessibilityLabel="Cambiar entre tema claro y oscuro"
            />
          </View>
        </View>
      )}
    </ScrollView>
  );
}

// ── Estilos ───────────────────────────────────────────────────────────────────

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
      paddingTop: 56,
      paddingBottom: t.spacing['2xl'],
      paddingHorizontal: t.spacing.lg,
      backgroundColor: t.colors.surfaceVariant,
      borderBottomWidth: t.borderWidths.thick,
      borderBottomColor: t.colors.border,
    },

    // ── Avatar frame pixel art ───────────────────
    avatarFrame: {
      width: 88,
      height: 88,
      borderWidth: t.borderWidths.thick,
      borderColor: t.colors.border,
      borderRadius: t.radius.sm,
      backgroundColor: t.colors.surface,
      overflow: 'hidden',
      marginBottom: t.spacing.md,
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
      width: 26,
      height: 26,
      backgroundColor: t.colors.primary,
      borderWidth: t.borderWidths.medium,
      borderColor: t.colors.border,
      borderRadius: t.radius.sm,
      justifyContent: 'center',
      alignItems: 'center',
    },

    // ── Textos del header ────────────────────────
    displayName: {
      fontFamily: t.typography.fontFamily,
      fontSize: t.typography.sizes.title,
      color: t.colors.textPrimary,
    },
    handle: {
      fontFamily: t.typography.fontFamilyMono,
      fontSize: t.typography.sizes.caption,
      color: t.colors.textSecondary,
      marginTop: 4,
    },

    // ── Toggle compacto (solo iconos) ────────────
    togglePill: {
      flexDirection: 'row',
      marginTop: t.spacing.lg,
      backgroundColor: t.colors.surface,
      borderWidth: t.borderWidths.thick,
      borderColor: t.colors.border,
      borderRadius: t.radius.pill,
      padding: t.borderWidths.medium,
      gap: t.borderWidths.medium,
    },
    toggleBtn: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: t.radius.full,
    },
    toggleBtnActive: {
      backgroundColor: t.colors.primary,
    },

    // ── Info container ───────────────────────────
    infoContainer: {
      paddingHorizontal: t.spacing.lg,
      marginTop: t.spacing.xl,
      gap: t.spacing.md,
    },

    // ── Stats grid ───────────────────────────────
    statsGrid: {
      flexDirection: 'row',
      gap: t.spacing.md,
    },
    statCard: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: t.colors.surface,
      borderWidth: t.borderWidths.thick,
      borderColor: t.colors.border,
      borderRadius: t.radius.md,
      paddingVertical: t.spacing.lg,
      paddingHorizontal: t.spacing.sm,
      gap: t.spacing.xs,
      ...t.elevation.sm,
    },
    statValue: {
      fontFamily: t.typography.fontFamily,
      fontSize: t.typography.sizes.subtitle,
      color: t.colors.textPrimary,
    },
    statLabel: {
      fontFamily: t.typography.fontFamilyMono,
      fontSize: t.typography.sizes.caption,
      color: t.colors.textMuted,
      textTransform: 'uppercase',
    },

    // ── Cards genericas ──────────────────────────
    card: {
      backgroundColor: t.colors.surface,
      borderWidth: t.borderWidths.thick,
      borderColor: t.colors.border,
      borderRadius: t.radius.md,
      padding: t.spacing.lg,
      ...t.elevation.sm,
    },
    cardTitle: {
      fontFamily: t.typography.fontFamily,
      fontSize: t.typography.sizes.overline,
      color: t.colors.textMuted,
      letterSpacing: 1,
      marginBottom: t.spacing.sm,
    },
    cardBody: {
      fontFamily: t.typography.fontFamilyMono,
      fontSize: t.typography.sizes.body,
      color: t.colors.textPrimary,
      lineHeight: t.typography.sizes.body * 1.7,
    },
    favRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.sm,
      marginBottom: t.spacing.sm,
    },

    // ── Filas de informacion ──────────────────────
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.sm,
      paddingVertical: t.spacing.sm,
    },
    infoLabel: {
      fontFamily: t.typography.fontFamily,
      fontSize: t.typography.sizes.overline,
      color: t.colors.textMuted,
      width: 72,
      flexShrink: 0,
    },
    infoValue: {
      fontFamily: t.typography.fontFamilyMono,
      fontSize: t.typography.sizes.body,
      color: t.colors.textPrimary,
      flex: 1,
    },
    infoDivider: {
      height: 1,
      backgroundColor: t.colors.divider,
      marginLeft: 24,
    },

    // ── Edit button ────────────────────────────
    editBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: t.spacing.sm,
      backgroundColor: t.colors.primary,
      borderWidth: t.borderWidths.thick,
      borderColor: t.colors.border,
      borderRadius: t.radius.md,
      paddingVertical: t.spacing.lg,
      minHeight: 52,
      ...t.elevation.sm,
    },
    editBtnText: {
      fontFamily: t.typography.fontFamily,
      fontSize: t.typography.sizes.overline,
      color: t.colors.textOnPrimary,
      letterSpacing: 1,
    },

    // ── Error text ─────────────────────────────
    errorText: {
      fontFamily: t.typography.fontFamilyMono,
      fontSize: t.typography.sizes.body,
      color: t.colors.error,
      textAlign: 'center',
      padding: t.spacing.lg,
    },

    // ── Settings container ───────────────────────
    settingsContainer: {
      paddingHorizontal: t.spacing.lg,
      marginTop: t.spacing.xl,
      gap: t.spacing.md,
    },
    settingRow: {
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
    settingInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      gap: t.spacing.md,
    },
    settingTexts: {
      flex: 1,
    },
    settingLabel: {
      fontFamily: t.typography.fontFamily,
      fontSize: t.typography.sizes.overline,
      color: t.colors.textPrimary,
    },
    settingHint: {
      fontFamily: t.typography.fontFamilyMono,
      fontSize: t.typography.sizes.caption,
      color: t.colors.textMuted,
      marginTop: 2,
    },
  });
}
