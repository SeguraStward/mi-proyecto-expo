/**
 * Configuración de fuentes del tema.
 */
import { Platform } from 'react-native';

export const ThemeFonts = Platform.select({
  ios: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    mono: 'Menlo',
  },
  android: {
    regular: 'Roboto',
    medium: 'Roboto-Medium',
    bold: 'Roboto-Bold',
    mono: 'monospace',
  },
  default: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    mono: 'monospace',
  },
})!;
