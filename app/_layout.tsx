import { Nunito_400Regular, Nunito_600SemiBold } from '@expo-google-fonts/nunito';
import { Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { PressStart2P_400Regular, useFonts } from '@expo-google-fonts/press-start-2p';
import { Quicksand_400Regular, Quicksand_600SemiBold } from '@expo-google-fonts/quicksand';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';

import { AuthProvider } from '@/src/context/AuthContext';
import { FontPreferencesProvider } from '@/src/context/FontPreferencesContext';
import { AppThemeProvider, useThemeToggle } from '@/src/context/ThemeContext';
import { ToastProvider } from '@/src/context/ToastContext';

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
          background: '#1C1410',  // Suelo nocturno
          card: '#2C231A',       // Panel madera oscura
          border: '#7B6B52',     // Madera iluminada
          primary: '#7BC67E',    // Esmeralda luna
          text: '#F2E8D5',       // Luz de luna calida
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: '#FEFAE0',  // Pergamino
          card: '#F0E6CE',       // Papel envejecido
          border: '#386641',     // Verde bosque
          primary: '#386641',    // Bosque profundo
          text: '#2B1D0E',       // Tinta oscura
        },
      };

  return (
    <ThemeProvider value={navTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
      </Stack>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PressStart2P: PressStart2P_400Regular,
    Nunito_400Regular,
    Nunito_600SemiBold,
    Poppins_400Regular,
    Poppins_600SemiBold,
    Quicksand_400Regular,
    Quicksand_600SemiBold,
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
    <AuthProvider>
      <AppThemeProvider>
        <FontPreferencesProvider>
          <ToastProvider>
            <RootNavigator />
          </ToastProvider>
        </FontPreferencesProvider>
      </AppThemeProvider>
    </AuthProvider>
  );
}
