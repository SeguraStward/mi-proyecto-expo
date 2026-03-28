/**
 * EditPlantForm — Formulario de edicion de datos de una planta.
 *
 * Carga datos existentes de Firestore, permite editar y valida con Zod.
 * Usa upsertPlant para crear o actualizar el documento.
 */

import { FormInput } from '@/src/components/ui';
import { useAuth } from '@/src/context/AuthContext';
import { useToast } from '@/src/context/ToastContext';
import { usePlantDetail } from '@/src/hooks/usePlantDetail';
import { plantEditSchema, type PlantEditFormInput } from '@/src/schemas/plant.schema';
import { upsertPlant } from '@/src/services/firestore';
import type { AppTheme } from '@/src/theme';
import { useAppTheme } from '@/src/theme/designSystem';
import { pickImage } from '@/src/utils/pickImage';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
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

export default function EditPlantForm() {
  const theme = useAppTheme();
  const s = getStyles(theme);
  const router = useRouter();
  const { user } = useAuth();
  const { id, defaultName, defaultSunlight, defaultWatering } =
    useLocalSearchParams<{
      id: string;
      defaultName?: string;
      defaultSunlight?: string;
      defaultWatering?: string;
    }>();
  const { plant, isLoading } = usePlantDetail(id);
  const { showToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const handlePickImage = async () => {
    const uri = await pickImage();
    if (uri) setPhotoUri(uri);
  };

  const { control, handleSubmit, reset, formState: { isDirty } } = useForm<PlantEditFormInput>({
    resolver: zodResolver(plantEditSchema) as any,
    mode: 'onSubmit',
    defaultValues: {
      nickname: defaultName ?? '',
      wateringFrequencyDays: defaultWatering ?? '7',
      sunlight: defaultSunlight ?? '',
      humidity: '',
      soilType: '',
      pruningSeason: '',
      currentHeightCm: '',
      potSizeCm: '',
    },
  });

  // Cargar foto existente
  useEffect(() => {
    if (plant?.photos?.[0]?.url && !photoUri) {
      setPhotoUri(plant.photos[0].url);
    }
  }, [plant, photoUri]);

  // Sobrescribir defaults cuando llegan datos reales de Firestore
  useEffect(() => {
    if (plant) {
      reset({
        nickname: plant.nickname ?? defaultName ?? '',
        wateringFrequencyDays: String(plant.careRules?.wateringFrequencyDays ?? defaultWatering ?? 7),
        sunlight: plant.careRules?.sunlight ?? defaultSunlight ?? '',
        humidity: plant.careRules?.humidity ?? '',
        soilType: plant.careRules?.soilType ?? '',
        pruningSeason: plant.careRules?.pruningSeason ?? '',
        currentHeightCm: plant.status?.currentHeightCm != null ? String(plant.status.currentHeightCm) : '',
        potSizeCm: plant.status?.potSizeCm != null ? String(plant.status.potSizeCm) : '',
      });
    }
  }, [plant, reset, defaultName, defaultSunlight, defaultWatering]);

  const onSubmit = async (data: PlantEditFormInput) => {
    if (!id) return;
    // zodResolver ya transformo strings a numeros — usamos data directamente
    const parsed = data as unknown as import('@/src/schemas/plant.schema').PlantEditFormData;
    setIsSaving(true);
    try {
      const now = new Date().toISOString();
      const photos = photoUri
        ? [{ url: photoUri, isPrimary: true, caption: '', takenAt: now }]
        : (plant?.photos ?? []);
      await upsertPlant(id, {
        userId: user?.uid ?? '',
        nickname: parsed.nickname,
        photos,
        careRules: {
          wateringFrequencyDays: parsed.wateringFrequencyDays,
          sunlight: parsed.sunlight,
          humidity: parsed.humidity ?? plant?.careRules?.humidity ?? '',
          fertilizerFrequencyDays: plant?.careRules?.fertilizerFrequencyDays ?? 30,
          soilType: parsed.soilType ?? plant?.careRules?.soilType ?? '',
          pruningSeason: parsed.pruningSeason ?? plant?.careRules?.pruningSeason ?? '',
          rotationFrequencyDays: plant?.careRules?.rotationFrequencyDays ?? 15,
        },
        status: {
          ...(plant?.status ?? {
            ageInMonths: 0,
            health: 'buena',
            careStreak: 0,
            waterLevel: 50,
            lastWateredAt: new Date().toISOString(),
            nextWateringDue: new Date().toISOString(),
          }),
          currentHeightCm: parsed.currentHeightCm ?? plant?.status?.currentHeightCm ?? 0,
          potSizeCm: parsed.potSizeCm ?? plant?.status?.potSizeCm ?? 0,
        },
      });
      showToast({ type: 'success', message: 'Planta actualizada correctamente' });
      router.back();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error al guardar';
      showToast({ type: 'error', message: msg });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[s.container, s.center]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

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
            accessibilityRole="button"
            accessibilityLabel="Volver"
            style={s.backBtn}
          >
            <Text style={[s.backText, { color: theme.colors.primary }]}>{'< VOLVER'}</Text>
          </Pressable>
          <Text style={s.title}>EDITAR PLANTA</Text>
          {plant && (
            <Text style={s.subtitle}>
              {plant.botanicalInfo?.commonName ?? plant.nickname}
            </Text>
          )}
        </View>

        {/* Foto de la planta */}
        <Pressable
          onPress={handlePickImage}
          style={s.photoPickerContainer}
          accessibilityRole="button"
          accessibilityLabel="Cambiar foto de la planta"
        >
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={s.photoPreview} />
          ) : (
            <View style={s.photoPlaceholder}>
              <MaterialCommunityIcons name="camera-plus" size={36} color={theme.colors.textMuted} />
              <Text style={s.photoPlaceholderText}>AGREGAR FOTO</Text>
            </View>
          )}
          <View style={s.photoBadge}>
            <MaterialCommunityIcons name="pencil" size={14} color={theme.colors.textOnPrimary} />
          </View>
        </Pressable>

        <View style={s.section}>
          <Text style={s.sectionTitle}>IDENTIDAD</Text>
          <FormInput
            control={control}
            name="nickname"
            label="APODO"
            placeholder="Nombre de tu planta"
            autoCapitalize="words"
          />
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>REGLAS DE CUIDADO</Text>
          <FormInput
            control={control}
            name="wateringFrequencyDays"
            label="FRECUENCIA DE RIEGO (DIAS)"
            placeholder="7"
            keyboardType="numeric"
            helperText="Cada cuantos dias regarla"
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
            label="HUMEDAD"
            placeholder="Alta, media, baja..."
          />
          <FormInput
            control={control}
            name="soilType"
            label="TIPO DE SUELO"
            placeholder="Universal, drenante, acido..."
          />
          <FormInput
            control={control}
            name="pruningSeason"
            label="TEMPORADA DE PODA"
            placeholder="Primavera, verano..."
          />
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>ESTADO ACTUAL</Text>
          <FormInput
            control={control}
            name="currentHeightCm"
            label="ALTURA ACTUAL (CM)"
            placeholder="30"
            keyboardType="numeric"
          />
          <FormInput
            control={control}
            name="potSizeCm"
            label="TAMANO DE MACETA (CM)"
            placeholder="20"
            keyboardType="numeric"
          />
        </View>

        <View style={s.actions}>
          <Pressable
            style={[s.btn, s.btnSave, !isDirty && s.btnDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={isSaving || !isDirty}
            accessibilityRole="button"
            accessibilityLabel="Guardar cambios"
          >
            {isSaving ? (
              <ActivityIndicator size="small" color={theme.colors.textOnPrimary} />
            ) : (
              <Text style={s.btnSaveText}>GUARDAR</Text>
            )}
          </Pressable>
          <Pressable
            style={[s.btn, s.btnCancel]}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Cancelar edicion"
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
    center: { justifyContent: 'center', alignItems: 'center' },
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
    photoBadge: {
      position: 'absolute',
      bottom: 6,
      right: 6,
      width: 28,
      height: 28,
      backgroundColor: t.colors.primary,
      borderWidth: t.borderWidths.medium,
      borderColor: t.colors.border,
      borderRadius: t.radius.sm,
      justifyContent: 'center',
      alignItems: 'center',
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
    btnDisabled: { opacity: 0.5 },
  });
}
