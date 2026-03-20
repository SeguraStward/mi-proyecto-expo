/**
 * LoginScreen — Pantalla de bienvenida con animación de planta pixel art
 * Animaciones: entrada de planta (spring), bob continuo, título y form slide-up
 * Design System: Retro Garden DS v1.0 — useAppTheme()
 */

import { AppText } from '@/src/components/ui/AppText';
import { Input } from '@/src/components/ui/Input';
import { RetroButton } from '@/src/components/ui/RetroButton';
import { useAppTheme } from '@/src/theme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Haptics from 'expo-haptics';
import { Link, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export default function LoginScreen() {
  const theme = useAppTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // ── Shared values para animaciones ──────────────────────────────────────────

  // Planta — entrada + bob continuo
  const plantScale  = useSharedValue(0);
  const plantY      = useSharedValue(0);
  const plantRotate = useSharedValue(0);

  // Decoraciones — hojitas alrededor de la planta
  const leaf1Opacity = useSharedValue(0);
  const leaf1X       = useSharedValue(-10);
  const leaf2Opacity = useSharedValue(0);
  const leaf2X       = useSharedValue(10);
  const leaf3Opacity = useSharedValue(0);
  const leaf3Y       = useSharedValue(8);

  // Título y subtítulo
  const titleOpacity    = useSharedValue(0);
  const titleY          = useSharedValue(24);
  const subtitleOpacity = useSharedValue(0);

  // Formulario
  const formOpacity = useSharedValue(0);
  const formY       = useSharedValue(32);

  // ── Secuencia de entrada ─────────────────────────────────────────────────────

  useEffect(() => {
    // 1. Planta crece con spring (inmediato)
    plantScale.value = withSpring(1, { damping: 7, stiffness: 90, mass: 0.8 });

    // 2. Hojitas decorativas aparecen escalonadas
    leaf1Opacity.value = withDelay(300, withTiming(1, { duration: 350 }));
    leaf1X.value       = withDelay(300, withSpring(0, { damping: 10 }));
    leaf2Opacity.value = withDelay(450, withTiming(1, { duration: 350 }));
    leaf2X.value       = withDelay(450, withSpring(0, { damping: 10 }));
    leaf3Opacity.value = withDelay(550, withTiming(1, { duration: 350 }));
    leaf3Y.value       = withDelay(550, withSpring(0, { damping: 10 }));

    // 3. Título sube y aparece
    titleOpacity.value = withDelay(400, withTiming(1, { duration: 500 }));
    titleY.value       = withDelay(400, withSpring(0, { damping: 14, stiffness: 80 }));

    // 4. Subtítulo fade in
    subtitleOpacity.value = withDelay(650, withTiming(1, { duration: 400 }));

    // 5. Formulario sube
    formOpacity.value = withDelay(750, withTiming(1, { duration: 400 }));
    formY.value       = withDelay(750, withSpring(0, { damping: 16, stiffness: 80 }));

    // 6. Bob continuo de la planta (empieza después de la entrada)
    plantY.value = withDelay(
      800,
      withRepeat(
        withSequence(
          withTiming(-9, { duration: 750, easing: Easing.inOut(Easing.ease) }),
          withTiming(0,  { duration: 750, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      ),
    );

    // 7. Rotación suave sincronizada con el bob
    plantRotate.value = withDelay(
      800,
      withRepeat(
        withSequence(
          withTiming(-0.04, { duration: 750, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.04,  { duration: 750, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      ),
    );
  }, []);

  // ── Estilos animados ─────────────────────────────────────────────────────────

  const plantAnimStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: plantScale.value },
      { translateY: plantY.value },
      { rotate: `${plantRotate.value}rad` },
    ],
  }));

  const leaf1Style = useAnimatedStyle(() => ({
    opacity: leaf1Opacity.value,
    transform: [{ translateX: leaf1X.value }],
  }));

  const leaf2Style = useAnimatedStyle(() => ({
    opacity: leaf2Opacity.value,
    transform: [{ translateX: leaf2X.value }],
  }));

  const leaf3Style = useAnimatedStyle(() => ({
    opacity: leaf3Opacity.value,
    transform: [{ translateY: leaf3Y.value }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleY.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const formStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
    transform: [{ translateY: formY.value }],
  }));

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleLogin = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace('/(app)/(tabs)/profile');
  };

  // ── Estilos estáticos ─────────────────────────────────────────────────────────

  const s = StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scroll: {
      flexGrow: 1,
      justifyContent: 'center',
    },
    inner: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: theme.spacing['2xl'],
      paddingVertical: theme.spacing['3xl'],
    },

    // ── Sección planta ──
    plantSection: {
      alignItems: 'center',
      marginBottom: theme.spacing['2xl'],
    },
    spriteBox: {
      width: 112,
      height: 112,
      borderWidth: theme.borderWidths.pixel,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      // sombra sólida pixel art
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 4,
    },
    pixelDot: {
      width: 8,
      height: 8,
      borderRadius: 0, // cuadrado pixel art
      backgroundColor: theme.colors.primaryLight,
    },

    // hojas decorativas
    leafRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.sm,
    },
    leafBottom: {
      alignItems: 'center',
      marginTop: theme.spacing.xs,
    },

    // ── Sección título ──
    titleSection: {
      alignItems: 'center',
      marginBottom: theme.spacing['3xl'],
    },
    appName: {
      textAlign: 'center',
      lineHeight: 32,
      color: theme.colors.primary,
    },
    tagline: {
      textAlign: 'center',
      marginTop: theme.spacing.sm,
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.lg,
    },
    dividerLine: {
      flex: 1,
      height: theme.borderWidths.medium,
      backgroundColor: theme.colors.border,
    },

    // ── Formulario ──
    formCard: {
      backgroundColor: theme.colors.surface,
      borderWidth: theme.borderWidths.thick,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.xl,
      // sombra pixel art
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 3, height: 3 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 3,
    },
    registerRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: theme.spacing.xl,
      gap: theme.spacing.xs,
    },
  });

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <KeyboardAvoidingView
      style={s.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={s.inner}>

          {/* ── Planta pixel art animada ── */}
          <View style={s.plantSection}>
            <Animated.View style={[s.spriteBox, plantAnimStyle]}>
              <MaterialCommunityIcons
                name="sprout"
                size={64}
                color={theme.colors.primary}
              />
              {/* pixel dots decorativos dentro del sprite box */}
              <View style={[s.pixelDot, {
                position: 'absolute', top: 8, right: 10,
                backgroundColor: theme.colors.primaryLight, opacity: 0.6,
              }]} />
              <View style={[s.pixelDot, {
                position: 'absolute', bottom: 10, left: 8,
                backgroundColor: theme.colors.secondary, opacity: 0.5,
                width: 6, height: 6,
              }]} />
            </Animated.View>

            {/* Hojitas decorativas bajo la planta */}
            <View style={s.leafRow}>
              <Animated.View style={leaf1Style}>
                <MaterialCommunityIcons
                  name="leaf"
                  size={16}
                  color={theme.colors.primaryLight}
                />
              </Animated.View>
              <Animated.View style={leaf2Style}>
                <MaterialCommunityIcons
                  name="flower"
                  size={14}
                  color={theme.colors.secondary}
                />
              </Animated.View>
              <Animated.View style={leaf1Style}>
                <MaterialCommunityIcons
                  name="leaf"
                  size={16}
                  color={theme.colors.primaryLight}
                />
              </Animated.View>
            </View>

            <Animated.View style={[s.leafBottom, leaf3Style]}>
              <MaterialCommunityIcons
                name="dots-horizontal"
                size={20}
                color={theme.colors.border}
              />
            </Animated.View>
          </View>

          {/* ── Nombre de la app ── */}
          <Animated.View style={[s.titleSection, titleStyle]}>
            <AppText preset="title" style={s.appName}>
              Pixel{'\n'}Garden
            </AppText>

            <Animated.View style={subtitleStyle}>
              <AppText
                preset="caption"
                color={theme.colors.textSecondary}
                style={s.tagline}
              >
                — Tu jardín digital —
              </AppText>
            </Animated.View>

            <View style={s.divider}>
              <View style={s.dividerLine} />
              <MaterialCommunityIcons
                name="seed-outline"
                size={14}
                color={theme.colors.border}
              />
              <View style={s.dividerLine} />
            </View>
          </Animated.View>

          {/* ── Formulario ── */}
          <Animated.View style={formStyle}>
            <View style={s.formCard}>
              <AppText
                preset="overline"
                color={theme.colors.textSecondary}
                style={{ marginBottom: theme.spacing.lg, textAlign: 'center' }}
              >
                INICIAR SESIÓN
              </AppText>

              <Input
                label="Correo electrónico"
                placeholder="granjero@jardin.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />

              <Input
                label="Contraseña"
                placeholder="••••••••"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />

              <RetroButton
                label="[ ENTRAR ]"
                onPress={handleLogin}
                style={{ marginTop: theme.spacing.md }}
                accessibilityLabel="Iniciar sesión en El Invernadero"
              />
            </View>

            {/* Link a registro */}
            <View style={s.registerRow}>
              <AppText preset="caption" color={theme.colors.textMuted}>
                ¿No tienes cuenta?
              </AppText>
              <Link
                href="/(auth)/register"
                accessibilityRole="link"
                accessibilityLabel="Ir a registrarse"
              >
                <AppText preset="caption" color={theme.colors.primary}>
                  {' REGISTRARSE'}
                </AppText>
              </Link>
            </View>
          </Animated.View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
