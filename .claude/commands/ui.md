# Retro Garden — Frontend Skill

Eres un experto en el frontend de **Retro Garden**, una app React Native + Expo con estética **RPG pixel art estilo Stardew Valley**. Toda implementación debe respetar estrictamente las convenciones del proyecto.

---

## Stack técnico

- **React Native** 0.81.5 + **React** 19.1
- **Expo SDK 54** (managed workflow)
- **TypeScript** 5.9.2 (tipado estricto, sin `any`)
- **Expo Router** 6 (file-based routing)
- **react-native-reanimated** v4.1.1 (todas las animaciones)
- **expo-haptics** v15.0.8 (feedback táctil)
- **expo-linear-gradient** v15.0.8
- **expo-image** v3.0.11
- **@expo/vector-icons** (MaterialCommunityIcons)

---

## Design System: Retro Garden DS (RGDS v1.0)

**Estética:** 8-bit/16-bit pixel art. Bordes gruesos, sombras sólidas (sin blur), tipografía pixelada, paleta jardín/RPG.

### Hook principal
```typescript
import { useAppTheme } from '@/src/theme';
const theme = useAppTheme();
// theme.colors | theme.spacing | theme.typography | theme.radius | theme.borderWidths | theme.elevation
```

### Colores clave (light / dark)
| Token | Light | Dark |
|-------|-------|------|
| `colors.background` | `#FEFAE0` pergamino | `#1C1410` tierra noche |
| `colors.surface` | `#F0E6CE` papel viejo | `#2C231A` madera oscura |
| `colors.primary` | `#386641` verde bosque | `#7BC67E` verde luna |
| `colors.secondary` | `#BC6C25` madera cálida | `#E8B86D` oro linterna |
| `colors.textPrimary` | `#2B1D0E` tinta oscura | `#F2E8D5` luna cálida |
| `colors.textSecondary` | `#594A3C` café medio | `#C8BA9F` pergamino ilum. |
| `colors.border` | `#386641` verde bosque | `#7B6B52` madera ilum. |
| `colors.error` | `#AE2012` rojo profundo | `#F07167` rojo cálido |

### Tipografía
```typescript
// Presets disponibles en AppText
type TextPreset = 'hero' | 'title' | 'subtitle' | 'body' | 'bodySmall' | 'caption' | 'overline'

// Headings → Press Start 2P (pixel font)
// Body/Caption → Courier New (monoespaciado)

<AppText preset="title">Título RPG</AppText>
<AppText preset="body" color={theme.colors.textSecondary}>Texto normal</AppText>
```

### Espaciado (base-4)
```typescript
theme.spacing.xs   // 4px
theme.spacing.sm   // 8px
theme.spacing.md   // 12px
theme.spacing.lg   // 16px
theme.spacing.xl   // 20px
theme.spacing['2xl'] // 24px
theme.spacing['3xl'] // 32px
theme.spacing['4xl'] // 40px
theme.spacing['5xl'] // 48px
```

### Bordes y radio (pixel art)
```typescript
theme.radius.none  // 0px  — bloques perfectos
theme.radius.sm    // 2px
theme.radius.md    // 4px  — inputs, botones, cards
theme.radius.lg    // 6px
theme.radius.xl    // 8px
theme.radius.pill  // 16px — navegación
theme.radius.full  // 999px — avatares

theme.borderWidths.thin    // 1px
theme.borderWidths.medium  // 2px — outline estándar
theme.borderWidths.thick   // 3px — secciones destacadas
theme.borderWidths.pixel   // 4px — efecto bloque máximo
```

### Sombras (pixel art — sin blur)
```typescript
// Sombra sólida: shadowRadius: 0 + offset = efecto sprite
...theme.elevation.sm   // offset 2x2
...theme.elevation.md   // offset 3x3
...theme.elevation.lg   // offset 4x4
// shadowColor siempre = theme.colors.border (no negro)
```

---

## Componentes existentes

Importar desde `@/src/components/ui`:

```typescript
import {
  AppText,      // Tipografía con presets
  Card,         // Contenedor (elevated | outlined)
  PlantCard,    // Tarjeta planta (imagen + texto + rareza)
  Button,       // PrimaryButton MD3 (filled | outlined)
  RetroButton,  // Botón pixel art con sombra sólida
  Chip,         // Tag/filtro (active | inactive)
  Input,        // Campo de texto (label + error)
} from '@/src/components/ui';

import { BottomNavBar } from '@/src/components/common/BottomNavBar';
```

### Patrón de cada componente
```typescript
// 1. Hook de tema al inicio del componente
const theme = useAppTheme();

// 2. Estilos con getStyles(theme) o StyleSheet.create inline
const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.md,
    borderWidth: theme.borderWidths.medium,
    borderColor: theme.colors.border,
    ...theme.elevation.sm,
  },
});

// 3. Componente exportado con nombre nombrado (no default)
export function MiComponente({ prop }: Props) { ... }
```

---

## Componentes del roadmap (a crear)

Ver spec completa en `docs/GAMIFICATION_SPEC.md`:

| Componente | Ruta | Estado |
|-----------|------|--------|
| `PlantCareCard` | `src/components/ui/PlantCareCard.tsx` | Pendiente |
| `XPFloatingLabel` | `src/components/ui/XPFloatingLabel.tsx` | Pendiente |
| `ProgressBar` | `src/components/ui/ProgressBar.tsx` | Pendiente |
| `StreakBadge` | `src/components/ui/StreakBadge.tsx` | Pendiente |
| `RarityBadge` | `src/components/ui/RarityBadge.tsx` | Pendiente |
| `RoundCompleteModal` | `src/components/ui/RoundCompleteModal.tsx` | Pendiente |
| `SeasonalHeader` | `src/components/ui/SeasonalHeader.tsx` | Pendiente |
| `IdentifyFAB` | `src/components/ui/IdentifyFAB.tsx` | Pendiente |
| `AchievementToast` | `src/components/ui/AchievementToast.tsx` | Pendiente |
| `DailyProgressBar` | `src/components/ui/DailyProgressBar.tsx` | Pendiente |

---

## Reglas de animación (Reanimated v4)

```typescript
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  withDelay,
  withRepeat,
  runOnJS,
  Easing,
} from 'react-native-reanimated';

// Animación idle de sprite (loop infinito)
const bobY = useSharedValue(0);
useEffect(() => {
  bobY.value = withRepeat(
    withSequence(
      withTiming(-4, { duration: 600, easing: Easing.inOut(Easing.ease) }),
      withTiming(0, { duration: 600, easing: Easing.inOut(Easing.ease) })
    ),
    -1, // infinito
    true
  );
}, []);

// Secuencia de riego (shake + feedback)
const shakeX = useSharedValue(0);
const triggerWater = () => {
  shakeX.value = withSequence(
    withTiming(-6, { duration: 60 }),
    withTiming(6, { duration: 60 }),
    withTiming(-4, { duration: 60 }),
    withTiming(4, { duration: 60 }),
    withTiming(0, { duration: 60 }),
  );
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
};

// XP flotante
const xpOpacity = useSharedValue(0);
const xpTranslateY = useSharedValue(0);
const showXP = () => {
  xpOpacity.value = 1;
  xpTranslateY.value = 0;
  xpTranslateY.value = withTiming(-40, { duration: 1000 });
  xpOpacity.value = withDelay(500, withTiming(0, { duration: 500 }));
};
```

**Reglas:**
- NUNCA usar `Animated` de React Native core (solo Reanimated)
- NUNCA usar `setTimeout` para animaciones (usar `withDelay`)
- Las animaciones de UI deben completarse en < 1500ms
- Usar `runOnJS` para callbacks que actualizan estado React tras animación
- Componentes animados: `<Animated.View>`, no `<View>`

---

## Patrones de accesibilidad (obligatorios)

```typescript
<Pressable
  accessibilityRole="button"
  accessibilityLabel="Descripción clara de la acción"
  accessibilityState={{ disabled: isDisabled, selected: isSelected }}
  accessibilityHint="Qué ocurrirá al activar"
/>
// Mínimo 44pt de área táctil
// minHeight: 44, minWidth: 44
```

---

## Estructura de archivos (convenciones)

```
src/components/ui/
  MiComponente.tsx       ← lógica + estilos juntos (< 200 líneas ideal)
  index.ts               ← re-exportar aquí al terminar

src/screens/
  MiPantalla/
    MiPantalla.tsx       ← componente principal
    MiPantalla.types.ts  ← tipos locales si son muchos (opcional)

app/(app)/(tabs)/
  nombre-tab.tsx         ← solo importa y renderiza la screen
```

**Imports:**
- Alias `@/` para la raíz del proyecto (tsconfig paths)
- Orden: React → React Native → Expo → librerías externas → internos

---

## Gamificación — contexto

| Rareza | Color | XP mult |
|--------|-------|---------|
| Común | `#9E9E9E` | ×1 |
| Poco común | `#4CAF50` | ×1.5 |
| Rara | `#2196F3` | ×2.5 |
| Épica | `#FFD700` | ×4 |

```typescript
type Rarity = 'common' | 'uncommon' | 'rare' | 'epic'

interface Plant {
  id: string; name: string; scientificName: string
  imageUri?: string; rarity: Rarity; level: number; xp: number
  wateringFrequencyDays: number; lastWateredAt: string
  nextWateringAt: string; isDueToday: boolean
  careHistory: CareEvent[]; notes?: string
}
```

---

## Tarea a realizar

$ARGUMENTS
