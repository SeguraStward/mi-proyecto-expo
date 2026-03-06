import { PressStart2P_400Regular, useFonts } from '@expo-google-fonts/press-start-2p';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';

import { AppThemeProvider, useThemeToggle } from '@/src/context/ThemeContext';

// Mantener splash screen visible mientras cargan las fuentes
SplashScreen.preventAutoHideAsync();

/** Componente interno que ya tiene acceso al ThemeContext */
function RootNavigator() {
  const { mode } = useThemeToggle();

  // Adaptar los colores del tema de navegación para que coincidan
  const navTheme = mode === 'dark'
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: '#1A120B',  // Tierra oscura
          card: '#1B3A1B',       // Verde oscuro (cards)
          border: '#A1887F',     // Cerca de madera
          primary: '#66BB6A',    // Verde esmeralda
          text: '#F1F8E9',       // Verde blanquecino
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: '#D7CCC8',  // Tierra media
          card: '#C8E6C9',       // Verde suave (cards)
          border: '#2E7D32',     // Verde bosque (borde)
          primary: '#2E7D32',    // Verde bosque
          text: '#1B0F0A',       // Café casi negro
        },
      };

  return (
    <ThemeProvider value={navTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Login desactivado temporalmente — entra directo a la app */}
        {/* <Stack.Screen name="(auth)" /> */}
        <Stack.Screen name="(app)" />
      </Stack>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PressStart2P: PressStart2P_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AppThemeProvider>
      <RootNavigator />
    </AppThemeProvider>
  );
}
