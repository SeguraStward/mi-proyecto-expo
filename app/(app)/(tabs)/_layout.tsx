/**
 * ============================================================================
 * TabLayout — Bottom Navigation Bar con Material Design 3
 * ============================================================================
 *
 * Implementa la navegacion principal siguiendo las directrices M3:
 *   - Indicador activo tipo pill (64x32dp) detras del icono
 *   - Labels siempre visibles (a diferencia de PlantParent MD2)
 *   - Acceso eficiente a cada seccion (un solo toque)
 *   - Bordes pixel art para estetica Stardew Valley
 *
 * Pantallas:
 *   - index (Jardin): Inventario de plantas — icono casa
 *   - explore: Biblioteca de plantas — icono hoja/eco
 *   - profile: Perfil de usuario — icono persona
 *
 * @see https://m3.material.io/components/navigation-bar/overview
 * @see docs/DESIGN_SYSTEM_RETRO.md
 * ============================================================================
 */

import { Tabs } from 'expo-router';
import React from 'react';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { BottomNavBar } from '@/src/components/common/BottomNavBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <BottomNavBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Jardin',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="house.fill" color={color} />
          ),
          tabBarAccessibilityLabel: 'Mi jardin \u2014 Inventario de plantas',
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explorar',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="leaf.fill" color={color} />
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
