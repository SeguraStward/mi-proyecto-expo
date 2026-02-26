import { PlantColors } from '@/src/constants/colors';
import { Link, router } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
  const handleRegister = () => {
    // TODO: Implementar lógica de registro
    router.replace('/(app)/(tabs)/profile');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={styles.emoji}>🌱</Text>
        <Text style={styles.title}>Crear Cuenta</Text>
        <Text style={styles.subtitle}>Únete a nuestra comunidad verde</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre completo"
          placeholderTextColor={PlantColors.textMuted}
        />
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor={PlantColors.textMuted}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor={PlantColors.textMuted}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Registrarme</Text>
        </TouchableOpacity>

        <Link href="/(auth)/login" style={styles.link}>
          <Text style={styles.linkText}>
            ¿Ya tienes cuenta? <Text style={styles.linkBold}>Inicia sesión</Text>
          </Text>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PlantColors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emoji: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: PlantColors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: PlantColors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 32,
  },
  input: {
    backgroundColor: PlantColors.surface,
    borderWidth: 1,
    borderColor: PlantColors.border,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    fontSize: 15,
    color: PlantColors.textPrimary,
    marginBottom: 14,
  },
  button: {
    backgroundColor: PlantColors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: PlantColors.textOnPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    marginTop: 20,
    alignSelf: 'center',
  },
  linkText: {
    fontSize: 14,
    color: PlantColors.textSecondary,
  },
  linkBold: {
    color: PlantColors.primary,
    fontWeight: '600',
  },
});
