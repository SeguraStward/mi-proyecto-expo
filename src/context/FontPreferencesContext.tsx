/**
 * ============================================================================
 * FontPreferencesContext — Preferencias de tipografia del usuario
 * ============================================================================
 *
 * Permite al usuario elegir la fuente del texto de lectura (body) y la escala
 * del tamano de letra. Persiste en AsyncStorage (mismo patron que ThemeContext).
 *
 * Los headings pixel (Press Start 2P) NO cambian: son identidad de marca.
 * La preferencia afecta a los presets de texto de lectura (body/bodySmall/
 * caption) y a la escala global de todos los presets, vIa AppText.
 * ============================================================================
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

// ── Fuentes seleccionables ──────────────────────────────────────────────────
// 'default' = look original (titulos pixel + cuerpo mono, sin forzar nada).
// El resto fuerza esa fuente en TODO el texto de la app.

export type BodyFontKey = 'default' | 'nunito' | 'poppins' | 'quicksand' | 'system';

/**
 * Familias por opcion: `heading` (titulos, SemiBold) y `body` (cuerpo, Regular).
 * undefined = fuente del sistema.
 */
export const FONT_FAMILIES: Record<
  BodyFontKey,
  { heading: string | undefined; body: string | undefined }
> = {
  default: { heading: undefined, body: undefined }, // modo Original: conserva el tema
  nunito: { heading: 'Nunito_600SemiBold', body: 'Nunito_400Regular' },
  poppins: { heading: 'Poppins_600SemiBold', body: 'Poppins_400Regular' },
  quicksand: { heading: 'Quicksand_600SemiBold', body: 'Quicksand_400Regular' },
  system: { heading: undefined, body: undefined },
};

/** Compat: fontFamily principal (cuerpo) por opcion. */
export const BODY_FONT_FAMILY: Record<BodyFontKey, string | undefined> = {
  default: undefined,
  nunito: 'Nunito_400Regular',
  poppins: 'Poppins_400Regular',
  quicksand: 'Quicksand_400Regular',
  system: undefined,
};

/** Opciones para la UI de configuracion (orden de presentacion). */
export const FONT_OPTIONS: { key: BodyFontKey; label: string }[] = [
  { key: 'default', label: 'Original' },
  { key: 'nunito', label: 'Nunito' },
  { key: 'poppins', label: 'Poppins' },
  { key: 'quicksand', label: 'Quicksand' },
  { key: 'system', label: 'Sistema' },
];

// ── Escala de tamano ────────────────────────────────────────────────────────

export type SizeScaleKey = 'small' | 'normal' | 'large' | 'xlarge';

export const SIZE_SCALE_VALUE: Record<SizeScaleKey, number> = {
  small: 0.85,
  normal: 1.0,
  large: 1.15,
  xlarge: 1.3,
};

export const SIZE_OPTIONS: { key: SizeScaleKey; label: string }[] = [
  { key: 'small', label: 'A-' },
  { key: 'normal', label: 'A' },
  { key: 'large', label: 'A+' },
  { key: 'xlarge', label: 'A++' },
];

// ── Contexto ────────────────────────────────────────────────────────────────

interface FontPreferencesValue {
  bodyFont: BodyFontKey;
  /** fontFamily resuelta (undefined = sistema). */
  bodyFontFamily: string | undefined;
  sizeKey: SizeScaleKey;
  /** Multiplicador numerico del tamano de letra. */
  sizeScale: number;
  setBodyFont: (font: BodyFontKey) => void;
  setSizeKey: (size: SizeScaleKey) => void;
  isLoading: boolean;
}

const DEFAULTS: Pick<FontPreferencesValue, 'bodyFont' | 'sizeKey'> = {
  bodyFont: 'default',
  sizeKey: 'normal',
};

const FontPreferencesContext = createContext<FontPreferencesValue | undefined>(undefined);

const FONT_KEY = '@retro_garden_font_family';
const SCALE_KEY = '@retro_garden_font_scale';

export const FontPreferencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bodyFont, setBodyFontState] = useState<BodyFontKey>(DEFAULTS.bodyFont);
  const [sizeKey, setSizeKeyState] = useState<SizeScaleKey>(DEFAULTS.sizeKey);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar preferencias guardadas al iniciar.
  useEffect(() => {
    Promise.all([AsyncStorage.getItem(FONT_KEY), AsyncStorage.getItem(SCALE_KEY)])
      .then(([font, scale]) => {
        if (font && font in BODY_FONT_FAMILY) setBodyFontState(font as BodyFontKey);
        if (scale && scale in SIZE_SCALE_VALUE) setSizeKeyState(scale as SizeScaleKey);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const setBodyFont = useCallback((font: BodyFontKey) => {
    setBodyFontState(font);
    AsyncStorage.setItem(FONT_KEY, font).catch(() => {});
  }, []);

  const setSizeKey = useCallback((size: SizeScaleKey) => {
    setSizeKeyState(size);
    AsyncStorage.setItem(SCALE_KEY, size).catch(() => {});
  }, []);

  const value = useMemo<FontPreferencesValue>(
    () => ({
      bodyFont,
      bodyFontFamily: BODY_FONT_FAMILY[bodyFont],
      sizeKey,
      sizeScale: SIZE_SCALE_VALUE[sizeKey],
      setBodyFont,
      setSizeKey,
      isLoading,
    }),
    [bodyFont, sizeKey, setBodyFont, setSizeKey, isLoading],
  );

  return (
    <FontPreferencesContext.Provider value={value}>
      {children}
    </FontPreferencesContext.Provider>
  );
};

/**
 * Acceso a las preferencias tipograficas.
 * Devuelve valores por defecto si se usa fuera del provider (para que AppText
 * nunca falle si se renderiza antes de montar el provider).
 */
export function useFontPreferences(): FontPreferencesValue {
  const ctx = useContext(FontPreferencesContext);
  if (ctx) return ctx;
  return {
    bodyFont: DEFAULTS.bodyFont,
    bodyFontFamily: BODY_FONT_FAMILY[DEFAULTS.bodyFont],
    sizeKey: DEFAULTS.sizeKey,
    sizeScale: SIZE_SCALE_VALUE[DEFAULTS.sizeKey],
    setBodyFont: () => {},
    setSizeKey: () => {},
    isLoading: false,
  };
}
