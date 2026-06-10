/**
 * ============================================================================
 * BottomNavBar — Barra de navegacion inferior animada (Material Design 3)
 * ============================================================================
 *
 * Patron M3 "navigation bar" con animacion de ahorro de espacio:
 *   - Las pestañas INACTIVAS se encogen a solo icono (pill compacta).
 *   - La pestaña ACTIVA expande su etiqueta dentro de una pill, con animacion
 *     suave (react-native-reanimated).
 *   - Altura de contenedor reducida vs. la version estatica.
 *   - Bordes gruesos pixel art para estetica retro Stardew Valley.
 *
 * Accesibilidad (no se degrada al ocultar labels):
 *   - accessibilityRole="tab" + accessibilityState.selected por destino.
 *   - accessibilityLabel SIEMPRE presente (tabBarAccessibilityLabel/title),
 *     asi los lectores de pantalla anuncian cada pestaña aunque su texto
 *     este colapsado visualmente.
 *   - Area de toque por pestaña: flex:1 + minHeight 48 (Apple HIG + M3).
 *
 * @see https://m3.material.io/components/navigation-bar/overview
 * ============================================================================
 */

import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React, { useEffect, useState } from 'react';
import {
    Keyboard,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { AppTheme } from '@/src/theme';
import { useAppTheme } from '@/src/theme';

function withAlpha(hexColor: string, alpha: number): string {
  const safeAlpha = Math.max(0, Math.min(1, alpha));
  if (!hexColor.startsWith('#')) return hexColor;

  const hex = hexColor.slice(1);
  const normalized =
    hex.length === 3
      ? hex.split('').map((c) => c + c).join('')
      : hex.length === 6
        ? hex
        : null;

  if (!normalized) return hexColor;

  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${safeAlpha})`;
}

interface TabButtonProps {
  theme: AppTheme;
  label: string;
  isFocused: boolean;
  accessibilityLabel?: string;
  renderIcon?: (args: { color: string; focused: boolean; size: number }) => React.ReactNode;
  onPress: () => void;
  onLongPress: () => void;
}

function TabButton({
  theme,
  label,
  isFocused,
  accessibilityLabel,
  renderIcon,
  onPress,
  onLongPress,
}: TabButtonProps) {
  // 1 = activa (label expandida), 0 = inactiva (solo icono).
  const progress = useSharedValue(isFocused ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(isFocused ? 1 : 0, { duration: 220 });
  }, [isFocused, progress]);

  const pillStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ['rgba(0,0,0,0)', theme.colors.primaryPale],
    ),
    paddingHorizontal: 10 + progress.value * 6,
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    maxWidth: progress.value * 96,
    marginLeft: progress.value * 6,
  }));

  const iconColor = isFocused ? theme.colors.primary : theme.colors.textMuted;

  return (
    <TouchableOpacity
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
      style={styles.tab}
    >
      <Animated.View style={[styles.pill, pillStyle]}>
        {renderIcon?.({ color: iconColor, focused: isFocused, size: 22 })}
        <Animated.View style={[styles.labelWrap, labelStyle]}>
          <Text
            numberOfLines={1}
            style={[
              styles.label,
              { color: theme.colors.primary, fontFamily: theme.typography.fontFamily },
            ]}
          >
            {label}
          </Text>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
}

export function BottomNavBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const bottomOffset = Math.max(insets.bottom, Platform.OS === 'android' ? 12 : 8);

  // Ocultar la barra flotante mientras el teclado este abierto, para no tapar
  // el campo de texto (p.ej. el composer del chat).
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  useEffect(() => {
    const showEvt = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvt = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const s1 = Keyboard.addListener(showEvt, () => setKeyboardVisible(true));
    const s2 = Keyboard.addListener(hideEvt, () => setKeyboardVisible(false));
    return () => {
      s1.remove();
      s2.remove();
    };
  }, []);

  if (keyboardVisible) return null;

  return (
    <View style={[styles.wrapper, { bottom: bottomOffset }]}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: withAlpha(theme.colors.surface, 0.92),
            borderWidth: theme.borderWidths.thick,
            borderColor: withAlpha(theme.colors.border, 0.9),
            ...Platform.select({
              ios: {
                shadowColor: theme.colors.shadow,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.8,
                shadowRadius: 10,
              },
              android: { elevation: 12 },
            }),
          },
        ]}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const label =
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : options.title ?? route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({ type: 'tabLongPress', target: route.key });
          };

          return (
            <TabButton
              key={route.key}
              theme={theme}
              label={label}
              isFocused={isFocused}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              renderIcon={options.tabBarIcon}
              onPress={onPress}
              onLongPress={onLongPress}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 14,
    right: 14,
    zIndex: 50,
  },
  container: {
    flexDirection: 'row',
    height: 58,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 22,
    overflow: 'hidden',
    paddingHorizontal: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  labelWrap: {
    overflow: 'hidden',
  },
  label: {
    fontSize: 9,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
