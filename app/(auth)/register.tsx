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
import { useAppTheme } from '@/src/theme/designSystem';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Link, router } from 'expo-router';
import React from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function RegisterScreen() {
  const theme = useAppTheme();

  const handleRegister = () => {
    // TODO: Implementar lógica de registro
    router.replace('/(app)/(tabs)/profile');
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
        />
        <Input
          label="Correo electrónico"
          placeholder="tucorreo@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          label="Contraseña"
          placeholder="Mínimo 8 caracteres"
          secureTextEntry
        />

        <PrimaryButton
          title="Registrarme"
          onPress={handleRegister}
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
