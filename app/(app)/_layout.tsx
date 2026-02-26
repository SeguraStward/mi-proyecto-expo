import { Stack } from 'expo-router';

export default function AppLayout() {
  // TODO: Aquí podrías verificar si el usuario está autenticado
  // Si no lo está, redirigir a (auth)/login
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
