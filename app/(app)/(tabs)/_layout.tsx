/**
 * ============================================================================
 * TabLayout — Bottom Tabs con estética Retro Garden pixel art
 * ============================================================================
 *
 * Propósito:
 *   Define la navegación principal con Bottom Tabs estilo 8-bit.
 *   Usa tokens del Retro Garden Design System para colores y bordes.
 *
 * Pantallas:
 *   - index (Jardín): Inventario de plantas — icono casa.
 *   - explore: Biblioteca de plantas — icono brújula.
 *   - profile: Perfil de usuario — icono persona.
 *
 * @see docs/DESIGN_SYSTEM_RETRO.md
 * ============================================================================
 */

import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAppTheme } from '@/src/theme/designSystem';

export default function TabLayout() {
  const theme = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: theme.borderWidths.thick,
        },
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarLabelStyle: {
          fontSize: 8,
          fontFamily: 'PressStart2P',
          letterSpacing: 0.5,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Jardin',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="house.fill" color={color} />
          ),
          tabBarAccessibilityLabel: 'Mi jardín — Inventario de plantas',
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explorar',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="paperplane.fill" color={color} />
          ),
          tabBarAccessibilityLabel: 'Explorar biblioteca de plantas',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="person.fill" color={color} />
          ),
          tabBarAccessibilityLabel: 'Tu perfil de usuario',
        }}
      />
    </Tabs>
  );
}
