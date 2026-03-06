/**
 * Ruta dinámica para PlantDetail.
 * Recibe parámetros de la planta vía searchParams.
 *
 * @see src/screens/PlantDetail/PlantDetail.tsx
 */

import PlantDetail from '@/src/screens/PlantDetail';
import { useAppTheme } from '@/src/theme/designSystem';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PlantDetailRoute() {
  const theme = useAppTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <PlantDetail />
    </SafeAreaView>
  );
}
