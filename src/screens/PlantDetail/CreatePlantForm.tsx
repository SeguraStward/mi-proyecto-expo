/**
 * CreatePlantForm — Formulario para agregar una nueva planta a Firestore.
 */

import { FormInput } from '@/src/components/ui';
import { useAuth } from '@/src/context/AuthContext';
import { useToast } from '@/src/context/ToastContext';
import { useNetworkStatus } from '@/src/hooks/useNetworkStatus';
import { plantCreateSchema, type PlantCreateFormInput } from '@/src/schemas/plant.schema';
import { createPlant, uploadPlantPhoto, upsertPlant } from '@/src/services/firestore';
import syncService from '@/src/services/syncService';
import { identificationStore, useIdentificationResult } from '@/src/stores/identificationStore';
import type { AppTheme } from '@/src/theme';
import { useAppTheme } from '@/src/theme/designSystem';
import { pickImage } from '@/src/utils/pickImage';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function CreatePlantForm() {
  const theme = useAppTheme();
  const s = getStyles(theme);
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [aiConfidence, setAiConfidence] = useState<number | null>(null);
  const identificationResult = useIdentificationResult();
  const { isConnected, isInternetReachable } = useNetworkStatus();
  const isOnline = isConnected && isInternetReachable;

  const handlePickImage = async () => {
    const uri = await pickImage();
    if (uri) setPhotoUri(uri);
  };

  const handleOpenCamera = () => {
    router.push('/(app)/plant/identify');
  };

  const { control, handleSubmit, setValue, formState: { errors } } = useForm<PlantCreateFormInput>({
    resolver: zodResolver(plantCreateSchema) as any,
    mode: 'onSubmit',
    defaultValues: {
      nickname: '',
      commonName: '',
      scientificName: '',
      wateringFrequencyDays: '7',
      sunlight: '',
      humidity: '',
      soilType: '',
    },
  });

  useEffect(() => {
    if (!identificationResult) return;
    setPhotoUri(identificationResult.photoUri);
    setAiConfidence(identificationResult.confidence);
    if (identificationResult.commonName) {
      setValue('commonName', identificationResult.commonName);
    }
    if (identificationResult.scientificName) {
      setValue('scientificName', identificationResult.scientificName);
    }
    if (identificationResult.care?.light) {
      setValue('sunlight', identificationResult.care.light);
    }
    if (identificationResult.care?.soil) {
      setValue('soilType', identificationResult.care.soil);
    }
    identificationStore.clear();
  }, [identificationResult, setValue]);

  const onSubmit = async (data: PlantCreateFormInput) => {
    if (!user?.uid) {
      showToast({ type: 'error', message: 'Debes iniciar sesion' });
      return;
    }
    // zodResolver ya transformo los strings a numeros — usamos data directamente
    const parsed = data as unknown as import('@/src/schemas/plant.schema').PlantCreateFormData;
    setIsSaving(true);
    const now = new Date().toISOString();
    const plantData = {
      userId: user.uid,
      nickname: parsed.nickname,
      photos: [],
      botanicalInfo: {
        commonName: parsed.commonName,
        scientificName: parsed.scientificName ?? '',
        family: '',
        origin: '',
        climate: '',
        toxicity: 'No toxica',
        maxHeight: '',
        growthRate: '',
      },
      careRules: {
        wateringFrequencyDays: parsed.wateringFrequencyDays,
        sunlight: parsed.sunlight,
        humidity: parsed.humidity ?? '',
        fertilizerFrequencyDays: 30,
        soilType: parsed.soilType ?? '',
        pruningSeason: '',
        rotationFrequencyDays: 15,
      },
      status: {
        ageInMonths: 0,
        currentHeightCm: 0,
        potSizeCm: 0,
        health: 'buena',
        careStreak: 0,
        waterLevel: 50,
        lastWateredAt: now,
        nextWateringDue: now,
      },
      createdAt: now,
      updatedAt: now,
    };

    try {
      if (!isOnline && Platform.OS !== 'web') {
        await syncService.queueCreatePlant({ plantData, photoUri });
        showToast({
          type: 'info',
          message: 'Sin conexion — se sincronizara al volver la red',
        });
        setTimeout(() => router.back(), 800);
        return;
      }

      const plantId = await createPlant(plantData);
      if (photoUri) {
        const photoUrl = await uploadPlantPhoto(plantId, photoUri);
        await upsertPlant(plantId, {
          photos: [{ url: photoUrl, isPrimary: true, caption: '', takenAt: now }],
        });
      }
      showToast({ type: 'success', message: 'Planta agregada al jardin!' });
      setTimeout(() => router.back(), 600);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error al crear planta';
      if (Platform.OS !== 'web') {
        await syncService
          .queueCreatePlant({ plantData, photoUri })
          .catch(() => {});
        showToast({
          type: 'info',
          message: 'Fallo al guardar — se reintentara automaticamente',
        });
        setTimeout(() => router.back(), 800);
      } else {
        showToast({ type: 'error', message: msg });
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={s.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={s.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={s.header}>
          <Pressable
            onPress={() => router.back()}
            style={s.backBtn}
            accessibilityRole="button"
            accessibilityLabel="Volver"
          >
            <Text style={[s.backText, { color: theme.colors.primary }]}>{'< VOLVER'}</Text>
          </Pressable>
          <Text style={s.title}>NUEVA PLANTA</Text>
          <Text style={s.subtitle}>Agrega una planta a tu jardin</Text>
        </View>

        {/* Foto de la planta */}
        <Pressable
          onPress={handlePickImage}
          style={s.photoPickerContainer}
          accessibilityRole="button"
          accessibilityLabel="Agregar foto de la planta"
        >
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={s.photoPreview} />
          ) : (
            <View style={s.photoPlaceholder}>
              <MaterialCommunityIcons name="camera-plus" size={36} color={theme.colors.textMuted} />
              <Text style={s.photoPlaceholderText}>AGREGAR FOTO</Text>
            </View>
          )}
        </Pressable>

        {/* Boton IDENTIFICAR CON IA */}
        <Pressable
          onPress={handleOpenCamera}
          style={s.aiButton}
          accessibilityRole="button"
          accessibilityLabel="Identificar planta con IA"
        >
          <MaterialCommunityIcons name="leaf" size={18} color={theme.colors.textOnPrimary} />
          <Text style={s.aiButtonText}>IDENTIFICAR CON IA</Text>
        </Pressable>

        {aiConfidence !== null ? (
          <View style={s.aiBadge}>
            <MaterialCommunityIcons
              name="check-circle-outline"
              size={14}
              color={theme.colors.primary}
            />
            <Text style={s.aiBadgeText}>
              DATOS SUGERIDOS POR IA · CONFIANZA {Math.round(aiConfidence * 100)}%
            </Text>
          </View>
        ) : null}

        <View style={s.section}>
          <Text style={s.sectionTitle}>IDENTIDAD</Text>
          <FormInput
            control={control}
            name="nickname"
            label="APODO"
            placeholder="Ej: Mi Monstera"
            autoCapitalize="words"
          />
          <FormInput
            control={control}
            name="commonName"
            label="NOMBRE COMUN"
            placeholder="Ej: Monstera, Cactus Barril..."
            autoCapitalize="words"
          />
          <FormInput
            control={control}
            name="scientificName"
            label="NOMBRE CIENTIFICO (OPCIONAL)"
            placeholder="Ej: Monstera deliciosa"
            autoCapitalize="words"
          />
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>CUIDADOS</Text>
          <FormInput
            control={control}
            name="wateringFrequencyDays"
            label="CADA CUANTOS DIAS REGARLA"
            placeholder="7"
            keyboardType="numeric"
          />
          <FormInput
            control={control}
            name="sunlight"
            label="LUZ SOLAR"
            placeholder="Sol directo, indirecto, sombra..."
          />
          <FormInput
            control={control}
            name="humidity"
            label="HUMEDAD (OPCIONAL)"
            placeholder="Alta, media, baja..."
          />
          <FormInput
            control={control}
            name="soilType"
            label="TIPO DE SUELO (OPCIONAL)"
            placeholder="Universal, drenante..."
          />
        </View>

        <View style={s.actions}>
          <Pressable
            style={[s.btn, s.btnSave]}
            onPress={handleSubmit(onSubmit, (errs) => console.log('Validation errors:', errs))}
            disabled={isSaving}
            accessibilityRole="button"
            accessibilityLabel="Agregar planta"
          >
            {isSaving ? (
              <ActivityIndicator size="small" color={theme.colors.textOnPrimary} />
            ) : (
              <Text style={s.btnSaveText}>+ AGREGAR PLANTA</Text>
            )}
          </Pressable>
          <Pressable
            style={[s.btn, s.btnCancel]}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Cancelar"
          >
            <Text style={s.btnCancelText}>CANCELAR</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function getStyles(t: AppTheme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: t.colors.background },
    scrollContent: { padding: t.spacing.lg, paddingTop: 56, paddingBottom: t.spacing['5xl'] },
    header: { marginBottom: t.spacing['2xl'] },
    backBtn: { marginBottom: t.spacing.md, minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start' },
    backText: { fontFamily: t.typography.fontFamily, fontSize: t.typography.sizes.caption },
    title: { fontFamily: t.typography.fontFamily, fontSize: t.typography.sizes.title, color: t.colors.textPrimary },
    subtitle: { fontFamily: t.typography.fontFamilyMono, fontSize: t.typography.sizes.body, color: t.colors.textSecondary, marginTop: 4 },
    photoPickerContainer: {
      alignSelf: 'center',
      marginBottom: t.spacing.lg,
      borderWidth: t.borderWidths.thick,
      borderColor: t.colors.border,
      borderRadius: t.radius.md,
      overflow: 'hidden',
      width: 160,
      height: 160,
      ...t.elevation.sm,
    },
    photoPreview: {
      width: '100%',
      height: '100%',
    },
    photoPlaceholder: {
      flex: 1,
      backgroundColor: t.colors.surfaceVariant,
      alignItems: 'center',
      justifyContent: 'center',
      gap: t.spacing.sm,
    },
    photoPlaceholderText: {
      fontFamily: t.typography.fontFamily,
      fontSize: t.typography.sizes.overline,
      color: t.colors.textMuted,
      letterSpacing: 1,
    },
    aiButton: {
      alignSelf: 'center',
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.sm,
      backgroundColor: t.colors.primary,
      borderWidth: t.borderWidths.thick,
      borderColor: t.colors.border,
      borderRadius: t.radius.md,
      paddingHorizontal: t.spacing.lg,
      paddingVertical: t.spacing.sm,
      marginBottom: t.spacing.md,
      ...t.elevation.sm,
    },
    aiButtonText: {
      fontFamily: t.typography.fontFamily,
      fontSize: t.typography.sizes.overline,
      color: t.colors.textOnPrimary,
      letterSpacing: 1,
    },
    aiBadge: {
      alignSelf: 'center',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: t.colors.surfaceVariant,
      borderWidth: t.borderWidths.thin,
      borderColor: t.colors.primary,
      borderRadius: t.radius.sm,
      paddingHorizontal: t.spacing.sm,
      paddingVertical: 4,
      marginBottom: t.spacing.md,
    },
    aiBadgeText: {
      fontFamily: t.typography.fontFamily,
      fontSize: 9,
      color: t.colors.primary,
      letterSpacing: 1,
    },
    section: {
      backgroundColor: t.colors.surface,
      borderWidth: t.borderWidths.thick,
      borderColor: t.colors.border,
      borderRadius: t.radius.md,
      padding: t.spacing.lg,
      marginBottom: t.spacing.lg,
      ...t.elevation.sm,
    },
    sectionTitle: {
      fontFamily: t.typography.fontFamily,
      fontSize: t.typography.sizes.overline,
      color: t.colors.textMuted,
      letterSpacing: 1,
      marginBottom: t.spacing.md,
    },
    actions: { gap: t.spacing.md, marginTop: t.spacing.md },
    btn: {
      borderWidth: t.borderWidths.thick,
      borderRadius: t.radius.md,
      paddingVertical: t.spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 52,
      ...t.elevation.sm,
    },
    btnSave: { backgroundColor: t.colors.primary, borderColor: t.colors.border },
    btnSaveText: { fontFamily: t.typography.fontFamily, fontSize: t.typography.sizes.overline, color: t.colors.textOnPrimary, letterSpacing: 1 },
    btnCancel: { backgroundColor: t.colors.surface, borderColor: t.colors.border },
    btnCancelText: { fontFamily: t.typography.fontFamily, fontSize: t.typography.sizes.overline, color: t.colors.textSecondary, letterSpacing: 1 },
  });
}
