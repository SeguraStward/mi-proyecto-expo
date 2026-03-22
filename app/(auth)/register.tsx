/**
 * ============================================================================
 * RegisterScreen — Pantalla de registro de usuario
 * ============================================================================
 *
 * Propósito:
 *   Pantalla para crear una nueva cuenta. Usa los componentes del DS
 *   (Input, PrimaryButton, AppText) y tokens centralizados.
 *   Navega a (app)/(tabs) al registrarse y a login para usuarios existentes.
 *
 * Componentes DS utilizados: Input, PrimaryButton, AppText
 * Tokens DS: colors, spacing, radius
 *
 * Accesibilidad:
 *   - Labels en todos los inputs.
 *   - Roles semánticos en botones y links.
 *   - Contraste >= 4.5:1.
 *
 * @see docs/DESIGN_SYSTEM.md
 * ============================================================================
 */

import { AppText } from '@/src/components/ui/AppText';
import { Input } from '@/src/components/ui/Input';
import { PrimaryButton } from '@/src/components/ui/PrimaryButton';
import { useAuth } from '@/src/context/AuthContext';
import { useAppTheme } from '@/src/theme/designSystem';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function RegisterScreen() {
  const theme = useAppTheme();
  const { register } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleRegister = async () => {
    const normalizedEmail = email.trim();

    if (!displayName.trim() || !normalizedEmail || !password) {
      setFormError('Completa nombre, correo y contraseña.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      await register(displayName, normalizedEmail, password);
      router.replace('/(app)/(tabs)/profile');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No fue posible crear la cuenta.';
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.content, { paddingHorizontal: theme.spacing['3xl'] }]}>
        <MaterialCommunityIcons
          name="sprout"
          size={48}
          color={theme.colors.primary}
          style={{ textAlign: 'center', marginBottom: theme.spacing.md }}
        />
        <AppText preset="title" style={{ textAlign: 'center' }}>
          Crear Cuenta
        </AppText>
        <AppText
          preset="bodySmall"
          color={theme.colors.textSecondary}
          style={{ textAlign: 'center', marginTop: theme.spacing.xs, marginBottom: theme.spacing['3xl'] }}
        >
          Únete a nuestra comunidad verde
        </AppText>

        <Input
          label="Nombre completo"
          placeholder="Tu nombre"
          value={displayName}
          onChangeText={setDisplayName}
        />
        <Input
          label="Correo electrónico"
          placeholder="tucorreo@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <Input
          label="Contraseña"
          placeholder="Mínimo 8 caracteres"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {formError ? (
          <AppText
            preset="caption"
            color={theme.colors.error}
            style={{ marginBottom: theme.spacing.sm }}
          >
            {formError}
          </AppText>
        ) : null}

        <PrimaryButton
          title="Registrarme"
          onPress={handleRegister}
          loading={isSubmitting}
          disabled={isSubmitting}
          style={{ marginTop: theme.spacing.sm }}
        />

        <Link
          href="/(auth)/login"
          style={{ marginTop: theme.spacing.xl, alignSelf: 'center' }}
          accessibilityRole="link"
          accessibilityLabel="Ir a la pantalla de inicio de sesión"
        >
          <Text style={{ fontSize: 11, fontFamily: 'Courier New', color: theme.colors.textSecondary }}>
            Ya tienes cuenta?{' '}
            <Text style={{ color: theme.colors.primary, fontFamily: 'PressStart2P', fontSize: 9 }}>
              Inicia sesion
            </Text>
          </Text>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center' },
  emoji: { fontSize: 48, textAlign: 'center', marginBottom: 8 },
});
