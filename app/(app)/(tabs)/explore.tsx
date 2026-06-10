/**
 * ============================================================================
 * Tab central — Renderiza la sala de chat grupal
 * ============================================================================
 *
 * Antes era "Explorar" (biblioteca de plantas). Ahora es el Chat.
 *
 * @see src/screens/Chat/Chat.tsx
 * ============================================================================
 */

import Chat from '@/src/screens/Chat';
import { useAppTheme } from '@/src/theme/designSystem';
import { View } from 'react-native';

export default function ChatTab() {
  const theme = useAppTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Chat />
    </View>
  );
}
