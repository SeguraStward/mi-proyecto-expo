/**
 * ============================================================================
 * ThemeContext — Proveedor global de tema con toggle claro/oscuro
 * ============================================================================
 *
 * Propósito:
 *   Permite al usuario cambiar manualmente entre tema claro y oscuro.
 *   Persiste la preferencia con AsyncStorage para que se recuerde
 *   al reabrir la app.
 *
 * Uso:
 *   Envuelve la app en <AppThemeProvider> y usa useThemeToggle() para
 *   obtener el modo actual y función de cambio.
 *
 * @see src/theme/index.ts — useAppTheme() lee de este contexto
 * ============================================================================
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { useColorScheme } from 'react-native';

import type { ThemeMode } from '@/src/theme/types';

const THEME_STORAGE_KEY = '@retro_garden_theme_mode';

interface ThemeContextValue {
  /** Modo actual: 'light' | 'dark' */
  mode: ThemeMode;
  /** Alterna entre claro y oscuro */
  toggleTheme: () => void;
  /** Establece un modo específico */
  setMode: (mode: ThemeMode) => void;
  /** true mientras se carga la preferencia guardada */
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const AppThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>(systemScheme === 'dark' ? 'dark' : 'light');
  const [isLoading, setIsLoading] = useState(true);

  // Cargar preferencia guardada al iniciar
  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then((saved: string | null) => {
        if (saved === 'light' || saved === 'dark') {
          setModeState(saved);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    AsyncStorage.setItem(THEME_STORAGE_KEY, newMode).catch(() => {});
  }, []);

  const toggleTheme = useCallback(() => {
    setMode(mode === 'light' ? 'dark' : 'light');
  }, [mode, setMode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, setMode, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook para acceder al toggle de tema.
 * Uso: const { mode, toggleTheme } = useThemeToggle();
 */
export function useThemeToggle(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useThemeToggle must be used within an AppThemeProvider');
  }
  return ctx;
}
