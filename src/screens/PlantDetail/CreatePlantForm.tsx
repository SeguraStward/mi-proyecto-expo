/**
 * CreatePlantForm — Formulario para agregar una nueva planta a Firestore.
 */

import { FormInput } from '@/src/components/ui';
import { useAuth } from '@/src/context/AuthContext';
import { useToast } from '@/src/context/ToastContext';
import { plantCreateSchema, type PlantCreateFormInput } from '@/src/schemas/plant.schema';
import { createPlant } from '@/src/services/firestore';
import type { AppTheme } from '@/src/theme';
import { useAppTheme } from '@/src/theme/designSystem';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  ActivityIndicator,
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

  const { control, handleSubmit } = useForm<PlantCreateFormInput>({
    resolver: zodResolver(plantCreateSchema),
    mode: 'onBlur',
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

  const onSubmit = async (data: PlantCreateFormInput) => {
    if (!user?.uid) return;
    setIsSaving(true);
    try {
      const parsed = plantCreateSchema.parse(data);
      const now = new Date().toISOString();
      await createPlant({
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
      });
      showToast({ type: 'success', message: 'Planta agregada al jardin!' });
      router.back();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error al crear planta';
      showToast({ type: 'error', message: msg });
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
            onPress={handleSubmit(onSubmit)}
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
