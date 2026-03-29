/**
 * Toast — Notificacion animada con estetica pixel art.
 * Usa Modal para garantizar que aparezca sobre todo el contenido,
 * incluyendo el navigation stack.
 */

import { useAppTheme } from '@/src/theme/designSystem';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
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
    success: { bg: theme.colors.surface, border: theme.colors.primary, icon: theme.colors.primary },
    error:   { bg: theme.colors.surface, border: theme.colors.error,   icon: theme.colors.error   },
    info:    { bg: theme.colors.surface, border: theme.colors.secondary, icon: theme.colors.secondary },
  };

  const colors = colorMap[type];

  useEffect(() => {
    if (visible) {
      translateY.value = -120;
      opacity.value = 0;
      translateY.value = withTiming(0, { duration: 300 });
      opacity.value = withTiming(1, { duration: 300 });
      opacity.value = withDelay(
        duration,
        withTiming(0, { duration: 300 }, (finished) => {
          if (finished) runOnJS(onDismiss)();
        }),
      );
      translateY.value = withDelay(duration, withTiming(-120, { duration: 300 }));
    }
  }, [visible, duration, onDismiss, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onDismiss}
    >
      {/* Capa transparente que no bloquea toques excepto en el toast */}
      <View style={styles.overlay} pointerEvents="box-none">
        <Animated.View
          style={[
            styles.container,
            animatedStyle,
            {
              top: insets.top + 8,
              backgroundColor: colors.bg,
              borderColor: colors.border,
              shadowColor: theme.colors.shadow,
              shadowOffset: { width: 3, height: 3 },
              shadowOpacity: 1,
              shadowRadius: 0,
              elevation: 8,
            },
          ]}
        >
          <Pressable
            style={styles.content}
            onPress={onDismiss}
            accessibilityRole="alert"
            accessibilityLabel={`${LABEL_MAP[type]}: ${message}`}
          >
            <MaterialCommunityIcons name={ICON_MAP[type]} size={22} color={colors.icon} style={styles.icon} />
            <View style={styles.textContainer}>
              <Text style={[styles.title, { color: colors.icon }]}>{LABEL_MAP[type]}</Text>
              <Text style={[styles.message, { color: theme.colors.textPrimary }]} numberOfLines={2}>
                {message}
              </Text>
            </View>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    borderWidth: 3,
    borderRadius: 4,
    zIndex: 99999,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    minHeight: 52,
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
