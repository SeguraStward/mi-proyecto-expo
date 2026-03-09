/**
 * ============================================================================
 * LoginScreen — Pantalla de inicio de sesión
 * ============================================================================
 *
 * Propósito:
 *   Pantalla de autenticación con campos de email y contraseña.
 *   Usa tokens del DS para todos los estilos (colores, espaciado, radios).
 *   Navega a (app)/(tabs) al autenticarse y a register para crear cuenta.
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

export default function LoginScreen() {
  const theme = useAppTheme();

  const handleLogin = () => {
    // TODO: Implementar lógica de autenticación
    router.replace('/(app)/(tabs)/profile');
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.content, { paddingHorizontal: theme.spacing['3xl'] }]}>
        <MaterialCommunityIcons
          name="leaf"
          size={48}
          color={theme.colors.primary}
          style={{ textAlign: 'center', marginBottom: theme.spacing.md }}
        />
        <AppText preset="title" style={{ textAlign: 'center' }}>
          Bienvenido
        </AppText>
        <AppText
          preset="bodySmall"
          color={theme.colors.textSecondary}
          style={{ textAlign: 'center', marginTop: theme.spacing.xs, marginBottom: theme.spacing['3xl'] }}
        >
          Inicia sesión para continuar
        </AppText>

        <Input
          label="Correo electrónico"
          placeholder="tucorreo@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          label="Contraseña"
          placeholder="Tu contraseña"
          secureTextEntry
        />

        <PrimaryButton
          title="Iniciar Sesión"
          onPress={handleLogin}
          style={{ marginTop: theme.spacing.sm }}
        />

        <Link
          href="/(auth)/register"
          style={{ marginTop: theme.spacing.xl, alignSelf: 'center' }}
          accessibilityRole="link"
          accessibilityLabel="Ir a la pantalla de registro"
        >
          <Text style={{ fontSize: 11, fontFamily: 'Courier New', color: theme.colors.textSecondary }}>
            No tienes cuenta?{' '}
            <Text style={{ color: theme.colors.primary, fontFamily: 'PressStart2P', fontSize: 9 }}>
              Registrate
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
