import OfflineBanner from '@/src/components/ui/OfflineBanner';
import { useAuth } from '@/src/context/AuthContext';
import { useAppTheme } from '@/src/theme/designSystem';
import { Redirect, Stack } from 'expo-router';
import { View } from 'react-native';

export default function AppLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const theme = useAppTheme();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="plant/[id]"
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="profile/edit"
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="plant/edit/[id]"
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="plant/new"
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="plant/identify"
        options={{
          headerShown: false,
          animation: 'slide_from_bottom',
          presentation: 'modal',
        }}
      />
      </Stack>
      <OfflineBanner />
    </View>
  );
}
