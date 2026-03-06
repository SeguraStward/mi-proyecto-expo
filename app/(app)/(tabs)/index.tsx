/**
 * ============================================================================
 * Tab Jardín — Renderiza GardenHome (inventario de plantas RPG)
 * ============================================================================
 *
 * @see src/screens/GardenHome/GardenHome.tsx
 * ============================================================================
 */

import GardenHome from '@/src/screens/GardenHome';
import { useAppTheme } from '@/src/theme/designSystem';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GardenTab() {
  const theme = useAppTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <GardenHome />
    </SafeAreaView>
  );
}
