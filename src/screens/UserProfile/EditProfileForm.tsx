/**
 * EditProfileForm — Formulario de edicion del perfil de usuario.
 *
 * Carga datos existentes de Firestore, permite editar y valida con Zod.
 * Muestra toast de exito/error al guardar.
 */

import { FormInput } from '@/src/components/ui';
import { useToast } from '@/src/context/ToastContext';
import { useAuth } from '@/src/context/AuthContext';
import { useUserProfile } from '@/src/hooks/useUserProfile';
import { userProfileSchema, type UserProfileFormData } from '@/src/schemas/user.schema';
import { updateUser } from '@/src/services/firestore';
import type { AppTheme } from '@/src/theme';
import { useAppTheme } from '@/src/theme/designSystem';
import type { UpdateUserDTO } from '@/src/types-dtos/user.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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

export default function EditProfileForm() {
  const theme = useAppTheme();
  const s = getStyles(theme);
  const router = useRouter();
  const { user } = useAuth();
  const { userDoc, isLoading: profileLoading, error: profileError } = useUserProfile();
  const { showToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const { control, handleSubmit, reset, formState: { isDirty } } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    mode: 'onBlur',
    defaultValues: {
      displayName: '',
      bio: '',
      instagram: '',
      whatsapp: '',
      country: '',
      province: '',
    },
  });

  // Cargar datos existentes al recibir el documento de Firestore
  useEffect(() => {
    if (userDoc) {
      reset({
        displayName: userDoc.displayName ?? '',
        bio: userDoc.profile?.bio ?? '',
        instagram: userDoc.contactInfo?.instagram ?? '',
        whatsapp: userDoc.contactInfo?.whatsapp ?? '',
        country: userDoc.location?.country ?? '',
        province: userDoc.location?.province ?? '',
      });
    }
  }, [userDoc, reset]);

  const onSubmit = async (data: UserProfileFormData) => {
    if (!user?.uid) return;
    setIsSaving(true);
    try {
      const updateData: UpdateUserDTO = {
        displayName: data.displayName,
        profile: {
          bio: data.bio ?? '',
          avatarUrl: userDoc?.profile?.avatarUrl ?? '',
        },
        contactInfo: {
          instagram: data.instagram ?? '',
          whatsapp: data.whatsapp ?? '',
        },
        location: {
          country: data.country ?? '',
          province: data.province ?? '',
        },
      };
      await updateUser(user.uid, updateData);
      showToast({ type: 'success', message: 'Perfil actualizado correctamente' });
      router.back();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error al guardar';
      showToast({ type: 'error', message: msg });
    } finally {
      setIsSaving(false);
    }
  };

  if (profileLoading) {
    return (
      <View style={[s.container, s.center]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (profileError) {
    return (
      <View style={[s.container, s.center]}>
        <Text style={s.errorText}>{profileError}</Text>
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
        {/* Header */}
        <View style={s.header}>
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Volver"
            style={s.backBtn}
          >
            <Text style={[s.backText, { color: theme.colors.primary }]}>{'< VOLVER'}</Text>
          </Pressable>
          <Text style={s.title}>EDITAR PERFIL</Text>
        </View>

        {/* Seccion: Informacion basica */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>INFORMACION</Text>
          <FormInput
            control={control}
            name="displayName"
            label="NOMBRE"
            placeholder="Tu nombre"
            autoCapitalize="words"
          />
          <FormInput
            control={control}
            name="bio"
            label="BIO"
            placeholder="Cuentanos sobre ti..."
            multiline
            helperText="Max 200 caracteres"
          />
        </View>

        {/* Seccion: Contacto */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>CONTACTO</Text>
          <FormInput
            control={control}
            name="instagram"
            label="INSTAGRAM"
            placeholder="tu_usuario"
            autoCapitalize="none"
          />
          <FormInput
            control={control}
            name="whatsapp"
            label="WHATSAPP"
            placeholder="+506 8888 8888"
            keyboardType="phone-pad"
          />
        </View>

        {/* Seccion: Ubicacion */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>UBICACION</Text>
          <FormInput
            control={control}
            name="country"
            label="PAIS"
            placeholder="Costa Rica"
            autoCapitalize="words"
          />
          <FormInput
            control={control}
            name="province"
            label="PROVINCIA"
            placeholder="San Jose"
            autoCapitalize="words"
          />
        </View>

        {/* Botones */}
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
    container: {
      flex: 1,
      backgroundColor: t.colors.background,
    },
    center: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    scrollContent: {
      padding: t.spacing.lg,
      paddingTop: 56,
      paddingBottom: t.spacing['5xl'],
    },
    header: {
      marginBottom: t.spacing['2xl'],
    },
    backBtn: {
      marginBottom: t.spacing.md,
      minHeight: 44,
      justifyContent: 'center',
      alignSelf: 'flex-start',
    },
    backText: {
      fontFamily: t.typography.fontFamily,
      fontSize: t.typography.sizes.caption,
    },
    title: {
      fontFamily: t.typography.fontFamily,
      fontSize: t.typography.sizes.title,
      color: t.colors.textPrimary,
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
    errorText: {
      fontFamily: t.typography.fontFamilyMono,
      fontSize: t.typography.sizes.body,
      color: t.colors.error,
      textAlign: 'center',
      padding: t.spacing.lg,
    },
    actions: {
      gap: t.spacing.md,
      marginTop: t.spacing.md,
    },
    btn: {
      borderWidth: t.borderWidths.thick,
      borderRadius: t.radius.md,
      paddingVertical: t.spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 52,
      ...t.elevation.sm,
    },
    btnSave: {
      backgroundColor: t.colors.primary,
      borderColor: t.colors.border,
    },
    btnSaveText: {
      fontFamily: t.typography.fontFamily,
      fontSize: t.typography.sizes.overline,
      color: t.colors.textOnPrimary,
      letterSpacing: 1,
    },
    btnCancel: {
      backgroundColor: t.colors.surface,
      borderColor: t.colors.border,
    },
    btnCancelText: {
      fontFamily: t.typography.fontFamily,
      fontSize: t.typography.sizes.overline,
      color: t.colors.textSecondary,
      letterSpacing: 1,
    },
    btnDisabled: {
      opacity: 0.5,
    },
  });
}
