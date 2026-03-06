import { UserProfile } from '@/src/screens/UserProfile';
import { useAppTheme } from '@/src/theme/designSystem';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileTab() {
  const theme = useAppTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <UserProfile />
    </SafeAreaView>
  );
}
