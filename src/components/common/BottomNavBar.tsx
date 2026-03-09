/**
 * ============================================================================
 * BottomNavBar — Barra de navegacion inferior Material Design 3
 * ============================================================================
 *
 * Implementacion conforme a las directrices de M3 Navigation Bar:
 *   - Indicador activo tipo pill (64x32dp, borderRadius 16)
 *   - Labels siempre visibles debajo de los iconos
 *   - Contraste WCAG AA entre estados activo/inactivo
 *   - Altura de contenedor: 80dp (especificacion M3)
 *   - Area de toque minima: 48dp (Apple HIG + M3)
 *   - Bordes gruesos pixel art para estetica retro Stardew Valley
 *
 * Accesibilidad:
 *   - accessibilityRole="tab" por cada destino
 *   - accessibilityState.selected para estado activo
 *   - Labels descriptivos via tabBarAccessibilityLabel
 *
 * @see https://m3.material.io/components/navigation-bar/overview
 * @see docs/DESIGN_SYSTEM_RETRO.md
 * ============================================================================
 */

import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { useAppTheme } from '@/src/theme';

export function BottomNavBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const theme = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderTopWidth: theme.borderWidths.thick,
          borderTopColor: theme.colors.border,
          // Sombra solida pixel art (solo hacia arriba)
          ...Platform.select({
            ios: {
              shadowColor: theme.colors.shadow,
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.8,
              shadowRadius: 0,
            },
            android: {
              elevation: 8,
            },
          }),
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        // Obtener el label del tab
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
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        // Colores segun estado activo/inactivo
        const iconColor = isFocused
          ? theme.colors.primary
          : theme.colors.textMuted;

        const labelColor = isFocused
          ? theme.colors.primary
          : theme.colors.textMuted;

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: isFocused }}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
            activeOpacity={0.7}
            style={styles.tab}
          >
            {/* Indicador M3 — pill detras del icono cuando activo */}
            <View
              style={[
                styles.indicator,
                isFocused && {
                  backgroundColor: theme.colors.primaryPale,
                  borderRadius: theme.radius.pill,
                },
              ]}
            >
              {options.tabBarIcon?.({
                color: iconColor,
                focused: isFocused,
                size: 24,
              })}
            </View>

            {/* Label — siempre visible segun especificacion M3 */}
            <Text
              style={[
                styles.label,
                {
                  color: labelColor,
                  fontFamily: theme.typography.fontFamily,
                },
              ]}
              numberOfLines={1}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 80,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: Platform.OS === 'ios' ? 8 : 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    minHeight: 48,
  },
  indicator: {
    width: 64,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    borderRadius: 16,
  },
  label: {
    fontSize: 8,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
