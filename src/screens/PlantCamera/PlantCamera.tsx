import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { CameraView } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import AIResultCard from '@/src/components/ui/AIResultCard';
import PermissionDeniedView from '@/src/components/ui/PermissionDeniedView';
import { useToast } from '@/src/context/ToastContext';
import { useCamera } from '@/src/hooks/useCamera';
import { usePlantIdentification } from '@/src/hooks/usePlantIdentification';
import { identificationStore } from '@/src/stores/identificationStore';
import type { AppTheme } from '@/src/theme';
import { useAppTheme } from '@/src/theme/designSystem';

type Mode = 'camera' | 'preview' | 'result';

export default function PlantCamera() {
  const theme = useAppTheme();
  const s = getStyles(theme);
  const router = useRouter();
  const { showToast } = useToast();

  const {
    cameraRef,
    permissions,
    isPermissionGranted,
    isLoadingPermissions,
    facing,
    flashMode,
    requestPermissions,
    takePhoto,
    toggleFacing,
    toggleFlash,
    error: cameraError,
  } = useCamera();

  const {
    identify,
    result,
    isLoading: isIdentifying,
    error: identifyError,
    reset: resetIdentification,
  } = usePlantIdentification();

  const [mode, setMode] = useState<Mode>('camera');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | undefined>();

  const handleCapture = async () => {
    const photo = await takePhoto({ quality: 0.8, base64: true });
    if (photo?.uri) {
      setPhotoUri(photo.uri);
      setPhotoBase64(photo.base64);
      setMode('preview');
    } else {
      showToast({ type: 'error', message: cameraError ?? 'No se pudo tomar la foto' });
    }
  };

  const handleIdentify = async () => {
    if (!photoUri) return;
    const identification = await identify(photoUri, {
      imageBase64: photoBase64,
    });
    if (identification) {
      setMode('result');
    }
  };

  const handleRetake = () => {
    setPhotoUri(null);
    setPhotoBase64(undefined);
    resetIdentification();
    setMode('camera');
  };

  const handleAccept = () => {
    if (!result) return;
    identificationStore.setResult(result);
    showToast({ type: 'success', message: 'Datos aplicados al formulario' });
    router.back();
  };

  // ── Sin permisos ───────────────────────────────────────────────────────────
  if (!isPermissionGranted) {
    return (
      <PermissionDeniedView
        cameraStatus={permissions?.camera ?? 'undetermined'}
        mediaLibraryStatus={permissions?.mediaLibrary ?? 'undetermined'}
        isLoading={isLoadingPermissions}
        onRequest={requestPermissions}
        onCancel={() => router.back()}
      />
    );
  }

  // ── Resultado de IA ────────────────────────────────────────────────────────
  if (mode === 'result' && result) {
    return (
      <ScrollView style={s.container} contentContainerStyle={s.resultScroll}>
        <View style={s.resultHeader}>
          <Pressable onPress={() => router.back()} style={s.backBtn}>
            <Text style={s.backText}>{'< VOLVER'}</Text>
          </Pressable>
          <Text style={s.resultTitle}>RESULTADO</Text>
        </View>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={s.resultPhoto} />
        ) : null}
        <AIResultCard result={result} onAccept={handleAccept} onDiscard={handleRetake} />
      </ScrollView>
    );
  }

  // ── Preview + identificar ──────────────────────────────────────────────────
  if (mode === 'preview' && photoUri) {
    return (
      <View style={s.container}>
        <View style={s.previewTopBar}>
          <Pressable onPress={handleRetake} style={s.backBtn}>
            <Text style={s.backText}>{'< REPETIR'}</Text>
          </Pressable>
          <Text style={s.previewTitle}>PREVIEW</Text>
          <View style={{ width: 80 }} />
        </View>
        <Image source={{ uri: photoUri }} style={s.previewImage} resizeMode="contain" />
        {identifyError ? (
          <View style={s.errorBox}>
            <Text style={s.errorText}>{identifyError}</Text>
          </View>
        ) : null}
        <View style={s.previewActions}>
          <Pressable
            style={[s.btn, s.btnPrimary]}
            onPress={handleIdentify}
            disabled={isIdentifying}
          >
            {isIdentifying ? (
              <ActivityIndicator size="small" color={theme.colors.textOnPrimary} />
            ) : (
              <Text style={s.btnPrimaryText}>IDENTIFICAR CON IA</Text>
            )}
          </Pressable>
          <Pressable
            style={[s.btn, s.btnOutline]}
            onPress={handleRetake}
            disabled={isIdentifying}
          >
            <Text style={s.btnOutlineText}>TOMAR OTRA</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // ── Camara activa ──────────────────────────────────────────────────────────
  return (
    <View style={s.container}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing={facing}
        flash={flashMode}
      />

      <View style={s.topBar} pointerEvents="box-none">
        <Pressable style={s.topBtn} onPress={() => router.back()}>
          <MaterialCommunityIcons name="close" size={24} color={theme.colors.white} />
        </Pressable>
        <Pressable style={s.topBtn} onPress={toggleFlash}>
          <MaterialCommunityIcons
            name={flashIcon(flashMode)}
            size={22}
            color={theme.colors.white}
          />
          <Text style={s.topBtnLabel}>{flashMode.toUpperCase()}</Text>
        </Pressable>
      </View>

      <View style={s.hint}>
        <Text style={s.hintText}>CENTRA LA PLANTA EN EL ENCUADRE</Text>
      </View>

      <View style={s.bottomBar}>
        <Pressable style={s.sideBtn} onPress={toggleFacing}>
          <MaterialCommunityIcons
            name="camera-flip-outline"
            size={26}
            color={theme.colors.white}
          />
        </Pressable>

        <Pressable
          style={s.captureBtn}
          onPress={handleCapture}
          accessibilityRole="button"
          accessibilityLabel="Tomar foto"
        >
          <View style={s.captureInner} />
        </Pressable>

        <View style={s.sideBtn} />
      </View>
    </View>
  );
}

function flashIcon(mode: string): 'flash' | 'flash-off' | 'flash-auto' {
  if (mode === 'on') return 'flash';
  if (mode === 'auto') return 'flash-auto';
  return 'flash-off';
}

function getStyles(t: AppTheme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: t.colors.black },
    topBar: {
      position: 'absolute',
      top: 48,
      left: 16,
      right: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      zIndex: 10,
    },
    topBtn: {
      backgroundColor: '#00000080',
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    topBtnLabel: {
      fontFamily: t.typography.fontFamily,
      fontSize: 10,
      color: t.colors.white,
      letterSpacing: 1,
    },
    hint: {
      position: 'absolute',
      top: 120,
      left: 0,
      right: 0,
      alignItems: 'center',
    },
    hintText: {
      fontFamily: t.typography.fontFamily,
      fontSize: 10,
      color: t.colors.white,
      backgroundColor: '#00000080',
      paddingHorizontal: 12,
      paddingVertical: 6,
      letterSpacing: 1,
    },
    bottomBar: {
      position: 'absolute',
      bottom: 48,
      left: 0,
      right: 0,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    sideBtn: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: '#00000080',
      alignItems: 'center',
      justifyContent: 'center',
    },
    captureBtn: {
      width: 80,
      height: 80,
      borderRadius: 40,
      borderWidth: 4,
      borderColor: t.colors.white,
      alignItems: 'center',
      justifyContent: 'center',
    },
    captureInner: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: t.colors.white,
    },
    previewTopBar: {
      paddingTop: 56,
      paddingHorizontal: 16,
      paddingBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: t.colors.background,
    },
    previewTitle: {
      fontFamily: t.typography.fontFamily,
      fontSize: t.typography.sizes.caption,
      color: t.colors.textPrimary,
      letterSpacing: 1,
    },
    previewImage: {
      flex: 1,
      width: '100%',
      backgroundColor: t.colors.black,
    },
    previewActions: {
      padding: t.spacing.lg,
      gap: t.spacing.sm,
      backgroundColor: t.colors.background,
    },
    resultScroll: {
      padding: t.spacing.lg,
      paddingTop: 56,
      paddingBottom: t.spacing['5xl'],
      gap: t.spacing.md,
    },
    resultHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.md,
      marginBottom: t.spacing.sm,
    },
    resultTitle: {
      fontFamily: t.typography.fontFamily,
      fontSize: t.typography.sizes.title,
      color: t.colors.textPrimary,
      letterSpacing: 1,
    },
    resultPhoto: {
      width: '100%',
      aspectRatio: 1,
      borderRadius: t.radius.md,
      borderWidth: t.borderWidths.thick,
      borderColor: t.colors.border,
    },
    backBtn: {
      minHeight: 44,
      justifyContent: 'center',
    },
    backText: {
      fontFamily: t.typography.fontFamily,
      fontSize: t.typography.sizes.caption,
      color: t.colors.primary,
      letterSpacing: 1,
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
    errorBox: {
      marginHorizontal: t.spacing.lg,
      padding: t.spacing.md,
      backgroundColor: t.colors.surface,
      borderWidth: t.borderWidths.thin,
      borderColor: t.colors.error,
      borderRadius: t.radius.sm,
    },
    errorText: {
      fontFamily: t.typography.fontFamilyMono,
      fontSize: t.typography.sizes.caption,
      color: t.colors.error,
    },
  });
}
