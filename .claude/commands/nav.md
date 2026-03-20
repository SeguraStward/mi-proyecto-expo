# Retro Garden — Navigation Skill

Antes de responder cualquier tarea, consulta este mapa y úsalo para navegar el proyecto sin exploración innecesaria.

---

## Mapa quirúrgico de archivos

### Para trabajar con el design system
```
src/theme/colors.ts        ← agregar/cambiar colores
src/theme/fonts.ts         ← tipografía, presets de texto
src/theme/spacing.ts       ← escala de espaciado base-4
src/theme/borders.ts       ← radius y borderWidths
src/theme/types.ts         ← tipo AppTheme (agregar propiedades aquí)
src/theme/light.ts         ← ensamblar tema claro
src/theme/dark.ts          ← ensamblar tema oscuro
src/theme/index.ts         ← hook useAppTheme() + re-exports
```

### Para crear o modificar componentes UI
```
src/components/ui/         ← carpeta de todos los componentes
src/components/ui/index.ts ← barrel export (SIEMPRE agregar aquí)
src/components/common/     ← BottomNavBar, Header, TabBar
src/components/customs/    ← CustomSafeAreaView
```

### Para trabajar con pantallas
```
src/screens/GardenHome/GardenHome.tsx      ← pantalla principal
src/screens/PlantDetail/PlantDetail.tsx    ← detalle de planta
src/screens/UserProfile/UserProfile.tsx   ← perfil de usuario
src/screens/UserProfile/UserProfile.styles.ts ← estilos separados
```

### Para modificar la navegación (Expo Router)
```
app/_layout.tsx                   ← root: fonts, ThemeProvider, Stack raíz
app/(app)/_layout.tsx             ← Stack: (tabs) + plant/[id]
app/(app)/(tabs)/_layout.tsx      ← TabBar con BottomNavBar
app/(app)/(tabs)/index.tsx        ← tab 1: GardenHome
app/(app)/(tabs)/explore.tsx      ← tab 2: Explore (WIP)
app/(app)/(tabs)/profile.tsx      ← tab 3: UserProfile
app/(app)/plant/[id].tsx          ← ruta dinámica PlantDetail
```

### Para contextos y estado global
```
src/context/ThemeContext.tsx  ← useThemeToggle() → { mode, toggleTheme, setMode }
src/context/AuthContext.tsx   ← auth (WIP)
src/hooks/useUserProfile.ts   ← hook perfil
src/types-dtos/user.types.ts  ← tipos globales compartidos
src/services/api.ts           ← llamadas a API externa
src/utils/helpers.ts          ← funciones de utilidad
```

---

## Recetas por tipo de tarea

### Agregar un nuevo color al design system
1. `src/theme/colors.ts` → agregar token en `LightColors` y `DarkColors`
2. `src/theme/types.ts` → si es una propiedad nueva en `ThemeColors`
3. `src/theme/light.ts` + `src/theme/dark.ts` → asignar valor

### Crear un nuevo componente UI
1. Crear `src/components/ui/NombreComponente.tsx`
2. Estructura mínima:
   ```typescript
   import { useAppTheme } from '@/src/theme';
   // lógica + StyleSheet.create
   export function NombreComponente({ ...props }: Props) { ... }
   ```
3. Agregar export en `src/components/ui/index.ts`

### Agregar un nuevo tab
1. Crear `app/(app)/(tabs)/nuevo-tab.tsx` (importa y renderiza screen)
2. Crear `src/screens/NuevaScreen/NuevaScreen.tsx`
3. Registrar en `app/(app)/(tabs)/_layout.tsx` → `<Tabs.Screen name="nuevo-tab" />`
4. Agregar ícono en `src/components/common/BottomNavBar.tsx`

### Agregar una ruta dinámica nueva
1. Crear `app/(app)/entidad/[id].tsx`
2. Registrar en `app/(app)/_layout.tsx` → `<Stack.Screen name="entidad/[id]" />`
3. Leer params: `const { id } = useLocalSearchParams()`
4. Navegar: `router.push({ pathname: '/(app)/entidad/[id]', params: { id: '1' } })`

### Persistir datos localmente
Seguir el patrón de `src/context/ThemeContext.tsx`:
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
const KEY = '@retro_garden_mi_dato';
await AsyncStorage.setItem(KEY, JSON.stringify(valor));
const saved = await AsyncStorage.getItem(KEY);
```

### Agregar animación con Reanimated
```typescript
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
// NUNCA usar Animated de react-native core
// NUNCA usar setTimeout para animaciones
// Usar <Animated.View> en lugar de <View>
```

### Agregar haptics
```typescript
import * as Haptics from 'expo-haptics';
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); // riego, logro
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);              // tap normal
```

---

## Convenciones de código

| Convención | Regla |
|-----------|-------|
| Exports | Nombrados siempre (`export function X`), nunca `export default` en componentes |
| Estilos | `StyleSheet.create()` con tokens del tema, nunca valores hardcoded |
| Imports | Alias `@/` para todo lo interno (ej: `@/src/theme`) |
| Tipos | TypeScript estricto, sin `any`. Tipos en el archivo o en `types-dtos/` |
| Componentes | Un archivo = un componente principal. < 200 líneas ideal |
| Animaciones | Solo `react-native-reanimated`, nunca RN `Animated` |
| Toque mínimo | `minHeight: 44, minWidth: 44` en todo elemento presionable |

---

## Componentes pendientes del roadmap
(definidos en `docs/GAMIFICATION_SPEC.md`)

```
PlantCareCard     → src/components/ui/PlantCareCard.tsx
XPFloatingLabel   → src/components/ui/XPFloatingLabel.tsx
ProgressBar       → src/components/ui/ProgressBar.tsx
StreakBadge       → src/components/ui/StreakBadge.tsx
RarityBadge       → src/components/ui/RarityBadge.tsx
RoundCompleteModal → src/components/ui/RoundCompleteModal.tsx
SeasonalHeader    → src/components/ui/SeasonalHeader.tsx
IdentifyFAB       → src/components/ui/IdentifyFAB.tsx
AchievementToast  → src/components/ui/AchievementToast.tsx
DailyProgressBar  → src/components/ui/DailyProgressBar.tsx
```

---

## Tarea a realizar

$ARGUMENTS
