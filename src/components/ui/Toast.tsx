/**
 * Toast — Notificacion animada con estetica pixel art.
 *
 * Variantes: success (verde), error (rojo), info (azul).
 * Slide-in desde arriba con Reanimated, auto-dismiss configurable.
 */

import { useAppTheme } from '@/src/theme/designSystem';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  type: ToastType;
  message: string;
  visible: boolean;
  onDismiss: () => void;
  duration?: number;
}

const ICON_MAP: Record<ToastType, keyof typeof MaterialCommunityIcons.glyphMap> = {
  success: 'check-circle',
  error: 'alert-circle',
  info: 'information',
};

const LABEL_MAP: Record<ToastType, string> = {
  success: 'OK!',
  error: 'ERROR',
  info: 'INFO',
};

export function Toast({ type, message, visible, onDismiss, duration = 3000 }: ToastProps) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(-120);
  const opacity = useSharedValue(0);

  const colorMap: Record<ToastType, { bg: string; border: string; icon: string }> = {
    success: {
      bg: theme.colors.surface,
      border: theme.colors.primary,
      icon: theme.colors.primary,
    },
    error: {
      bg: theme.colors.surface,
      border: theme.colors.error,
      icon: theme.colors.error,
    },
    info: {
      bg: theme.colors.surface,
      border: theme.colors.secondary,
      icon: theme.colors.secondary,
    },
  };

  const colors = colorMap[type];

  useEffect(() => {
    if (visible) {
      // Slide in
      translateY.value = withTiming(0, { duration: 300 });
      opacity.value = withTiming(1, { duration: 300 });

      // Auto-dismiss
      opacity.value = withDelay(
        duration,
        withTiming(0, { duration: 300 }, (finished) => {
          if (finished) runOnJS(onDismiss)();
        }),
      );
      translateY.value = withDelay(duration, withTiming(-120, { duration: 300 }));
    } else {
      translateY.value = -120;
      opacity.value = 0;
    }
  }, [visible, duration, onDismiss, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  const topOffset = Platform.OS === 'web' ? 16 : insets.top + 8;

  return (
    <Animated.View
      style={[
        styles.container,
        animatedStyle,
        {
          top: topOffset,
          backgroundColor: colors.bg,
          borderColor: colors.border,
          ...theme.elevation.md,
        },
      ]}
      pointerEvents="box-none"
    >
      <Pressable
        style={styles.content}
        onPress={onDismiss}
        accessibilityRole="alert"
        accessibilityLabel={`${LABEL_MAP[type]}: ${message}`}
      >
        <MaterialCommunityIcons
          name={ICON_MAP[type]}
          size={22}
          color={colors.icon}
          style={styles.icon}
        />
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.icon }]}>
            {LABEL_MAP[type]}
          </Text>
          <Text
            style={[styles.message, { color: theme.colors.textPrimary }]}
            numberOfLines={2}
          >
            {message}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: Platform.OS === 'web' ? ('fixed' as any) : 'absolute',
    left: 16,
    right: 16,
    borderWidth: 3,
    borderRadius: 4,
    zIndex: 99999,
    elevation: 99,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    minHeight: 44,
  },
  icon: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 9,
    fontFamily: 'PressStart2P',
    letterSpacing: 1,
    marginBottom: 4,
  },
  message: {
    fontSize: 12,
    fontFamily: 'Courier New',
    lineHeight: 16,
  },
});
