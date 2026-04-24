import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import type { AppTheme } from '@/src/theme';
import { useAppTheme } from '@/src/theme/designSystem';
import type { PermissionStatus } from '@/src/services/permissionService';

interface PermissionDeniedViewProps {
  cameraStatus: PermissionStatus;
  mediaLibraryStatus: PermissionStatus;
  isLoading?: boolean;
  onRequest: () => void;
  onCancel?: () => void;
}

function getMessage(camera: PermissionStatus, media: PermissionStatus): string {
  if (camera === 'denied' || media === 'denied') {
    return 'Los permisos fueron denegados. Actívalos desde la configuración del sistema para poder identificar plantas con la cámara.';
  }
  return 'Para identificar tus plantas con IA necesitamos acceso a la cámara y a tus fotos.';
}

async function openSystemSettings() {
  try {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      await Linking.openSettings();
    }
  } catch {
    // noop — si no se puede abrir, el botón simplemente no hace nada
  }
}

export const PermissionDeniedView: React.FC<PermissionDeniedViewProps> = ({
  cameraStatus,
  mediaLibraryStatus,
  isLoading = false,
  onRequest,
  onCancel,
}) => {
  const theme = useAppTheme();
  const s = getStyles(theme);

  const anyDenied = cameraStatus === 'denied' || mediaLibraryStatus === 'denied';
  const message = getMessage(cameraStatus, mediaLibraryStatus);

  return (
    <View style={s.container}>
      <View style={s.iconWrap}>
        <MaterialCommunityIcons
          name="camera-off-outline"
          size={64}
          color={theme.colors.textMuted}
        />
      </View>

      <Text style={s.title}>PERMISOS REQUERIDOS</Text>
      <Text style={s.message}>{message}</Text>

      <View style={s.statusBox}>
        <View style={s.statusRow}>
          <Text style={s.statusLabel}>CAMARA</Text>
          <Text style={[s.statusValue, { color: getStatusColor(theme, cameraStatus) }]}>
            {cameraStatus.toUpperCase()}
          </Text>
        </View>
        <View style={s.statusRow}>
          <Text style={s.statusLabel}>GALERIA</Text>
          <Text style={[s.statusValue, { color: getStatusColor(theme, mediaLibraryStatus) }]}>
            {mediaLibraryStatus.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={s.actions}>
        <Pressable
          style={[s.btn, s.btnPrimary]}
          onPress={onRequest}
          disabled={isLoading}
          accessibilityRole="button"
          accessibilityLabel="Solicitar permisos"
        >
          <Text style={s.btnPrimaryText}>
            {isLoading ? 'SOLICITANDO…' : 'SOLICITAR PERMISOS'}
          </Text>
        </Pressable>

        {anyDenied ? (
          <Pressable
            style={[s.btn, s.btnOutline]}
            onPress={openSystemSettings}
            accessibilityRole="button"
            accessibilityLabel="Abrir configuracion del sistema"
          >
            <Text style={s.btnOutlineText}>IR A CONFIGURACION</Text>
          </Pressable>
        ) : null}

        {onCancel ? (
          <Pressable
            style={[s.btn, s.btnCancel]}
            onPress={onCancel}
            accessibilityRole="button"
            accessibilityLabel="Volver"
          >
            <Text style={s.btnCancelText}>VOLVER</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
};

function getStatusColor(theme: AppTheme, status: PermissionStatus): string {
  if (status === 'granted') return theme.colors.success;
  if (status === 'denied') return theme.colors.error;
  return theme.colors.textMuted;
}

function getStyles(t: AppTheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: t.colors.background,
      padding: t.spacing.xl,
      alignItems: 'center',
      justifyContent: 'center',
      gap: t.spacing.lg,
    },
    iconWrap: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: t.colors.surfaceVariant,
      borderWidth: t.borderWidths.thick,
      borderColor: t.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: t.spacing.md,
    },
    title: {
      fontFamily: t.typography.fontFamily,
      fontSize: t.typography.sizes.title,
      color: t.colors.textPrimary,
      letterSpacing: 1,
      textAlign: 'center',
    },
    message: {
      fontFamily: t.typography.fontFamilyMono,
      fontSize: t.typography.sizes.body,
      color: t.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
      maxWidth: 320,
    },
    statusBox: {
      width: '100%',
      maxWidth: 320,
      backgroundColor: t.colors.surface,
      borderWidth: t.borderWidths.thick,
      borderColor: t.colors.border,
      borderRadius: t.radius.md,
      padding: t.spacing.md,
      gap: t.spacing.sm,
      ...t.elevation.sm,
    },
    statusRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    statusLabel: {
      fontFamily: t.typography.fontFamily,
      fontSize: t.typography.sizes.overline,
      color: t.colors.textMuted,
      letterSpacing: 1,
    },
    statusValue: {
      fontFamily: t.typography.fontFamily,
      fontSize: t.typography.sizes.caption,
      letterSpacing: 1,
    },
    actions: {
      width: '100%',
      maxWidth: 320,
      gap: t.spacing.sm,
      marginTop: t.spacing.md,
    },
    btn: {
      borderWidth: t.borderWidths.thick,
      borderRadius: t.radius.md,
      paddingVertical: t.spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 48,
    },
    btnPrimary: {
      backgroundColor: t.colors.primary,
      borderColor: t.colors.border,
      ...t.elevation.sm,
    },
    btnPrimaryText: {
      fontFamily: t.typography.fontFamily,
      fontSize: t.typography.sizes.overline,
      color: t.colors.textOnPrimary,
      letterSpacing: 1,
    },
    btnOutline: {
      backgroundColor: t.colors.surface,
      borderColor: t.colors.primary,
    },
    btnOutlineText: {
      fontFamily: t.typography.fontFamily,
      fontSize: t.typography.sizes.overline,
      color: t.colors.primary,
      letterSpacing: 1,
    },
    btnCancel: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
    },
    btnCancelText: {
      fontFamily: t.typography.fontFamily,
      fontSize: t.typography.sizes.overline,
      color: t.colors.textMuted,
      letterSpacing: 1,
    },
  });
}

export default PermissionDeniedView;
