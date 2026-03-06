# Retro Garden Design System — Documentación

> **Versión:** 1.0  
> **Tema:** Estética pixel art 8-bit/16-bit — Jardín retro  
> **Plataforma:** React Native (Expo SDK 54)

---

## 1. Filosofía de Diseño

El **Retro Garden DS** se inspira en los videojuegos retro de 8/16-bit.
Cada elemento visual simula sprites pixelados, cajas de diálogo RPG
y controles de interfaz propios de las consolas clásicas.

### Principios clave

| Principio | Implementación |
|-----------|---------------|
| **Bordes gruesos** | `borderWidth: 2-3px` en todo componente |
| **Sombras sólidas** | `shadowRadius: 0`, offset fijo, opacidad 1 |
| **Radios mínimos** | `0–8px` máximo (nada de pill shapes) |
| **Fuente pixel** | Press Start 2P para headings, Courier New para body |
| **Paleta retro** | Verdes vibrantes, crema amarillento, negro sólido |

---

## 2. Arquitectura Modular (`/src/theme/`)

```
src/theme/
├── colors.ts       → Paleta cromática (light + dark)
├── fonts.ts        → Tipografía (Press Start 2P / Courier New)
├── spacing.ts      → Escala de espaciado base-4
├── borders.ts      → Radius + border widths pixel art
├── types.ts        → Tipos compartidos (AppTheme, ThemeMode, etc.)
├── light.ts        → Tema claro ensamblado "Retro Forest Day"
├── dark.ts         → Tema oscuro ensamblado "Retro Forest Night"
├── index.ts        → Punto de entrada unificado + hooks
└── designSystem.ts → Re-exportación de compatibilidad (deprecated)
```

### Cómo importar

```tsx
// Recomendado
import { useAppTheme } from '@/src/theme';
import type { AppTheme } from '@/src/theme';

// Compatible (deprecated)
import { useAppTheme } from '@/src/theme/designSystem';
```

---

## 3. Tokens de Diseño

### 3.1 Colores

#### Light Mode — "Retro Forest Day"

| Token | Hex | Uso |
|-------|-----|-----|
| `primary` | `#38B000` | Verde lima — botones CTA |
| `secondary` | `#008000` | Verde oscuro — navegación |
| `background` | `#F1F8E9` | Papel crema amarillento |
| `surface` | `#FAFFF5` | Tarjetas y contenedores |
| `textPrimary` | `#1A1A1A` | Texto principal |
| `error` | `#FF0000` | Rojo puro de consola |
| `shadow` | `#1A1A1A` | Sombra sólida (sin transparencia) |

#### Dark Mode — "Retro Forest Night"

| Token | Hex | Uso |
|-------|-----|-----|
| `primary` | `#70E000` | Verde lima brillante |
| `background` | `#0A1A0A` | Negro verdoso profundo |
| `surface` | `#1A2A1A` | Superficie oscura |
| `textPrimary` | `#E8F5E9` | Texto claro |

### 3.2 Tipografía

| Preset | Fuente | Tamaño | Uso |
|--------|--------|--------|-----|
| `hero` | Press Start 2P | 24px | Títulos principales |
| `title` | Press Start 2P | 18px | Headings H1 |
| `subtitle` | Press Start 2P | 14px | Headings H2 |
| `body` | Courier New | 12px | Texto general |
| `bodySmall` | Courier New | 11px | Texto secundario |
| `caption` | Courier New | 10px | Metadata |
| `overline` | Courier New | 9px | Labels superiores |

> **Nota:** Los tamaños son intencionalmente más pequeños porque Press Start 2P
> es visualmente más grande que fuentes proporcionales estándar.

### 3.3 Espaciado (base-4)

| Token | Valor | Uso |
|-------|-------|-----|
| `xs` | 4px | Micro separaciones |
| `sm` | 8px | Padding interno chips |
| `md` | 12px | Gap entre elementos |
| `lg` | 16px | Padding de contenedores |
| `xl` | 20px | Márgenes de sección |
| `2xl` | 24px | Separación mayor |
| `3xl` | 32px | Espaciado de layouts |
| `4xl` | 40px | Espaciado hero |
| `5xl` | 48px | Padding bottom scroll |

### 3.4 Bordes

#### Radius (Pixel Art: mínimo redondeo)

| Token | Valor | Uso |
|-------|-------|-----|
| `none` | 0px | Barras de progreso |
| `sm` | 2px | Chips, badges |
| `md` | 4px | Cards, inputs |
| `lg` | 6px | Modales |
| `xl` | 8px | Headers |
| `full` | 999px | Avatares (excepcional) |

#### Border Widths (contornos tipo sprite)

| Token | Valor | Uso |
|-------|-------|-----|
| `thin` | 1px | Separadores internos |
| `medium` | 2px | Bordes normales |
| `thick` | 3px | Contornos principales |
| `pixel` | 4px | Énfasis máximo |

### 3.5 Elevación (Sombra Sólida)

Todas las sombras tienen `shadowRadius: 0` (sin blur) y `shadowOpacity: 1`
para lograr el efecto de sombra sólida tipo pixel art.

| Nivel | Offset | Uso |
|-------|--------|-----|
| `none` | 0,0 | Sin sombra |
| `sm` | 2,2 | Cards reposo |
| `md` | 3,3 | Botones, cards elevadas |
| `lg` | 4,4 | Modales, overlays |

---

## 4. Componentes

### 4.1 RetroButton

Botón estilo bloque de videojuego con sombra sólida.

```tsx
<RetroButton label="🌱 Plantar" onPress={handlePlant} />
<RetroButton label="Cancelar" variant="outlined" onPress={handleCancel} />
<RetroButton label="Cargando..." loading />
```

**Comportamiento "push":** Al presionar, el botón se desplaza 3px en X e Y
y pierde su sombra, simulando que el bloque se hunde.

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `label` | `string` | — | Texto del botón |
| `variant` | `'filled' \| 'outlined'` | `'filled'` | Variante visual |
| `loading` | `boolean` | `false` | Muestra spinner |
| `disabled` | `boolean` | `false` | Desactiva interacción |

### 4.2 PlantCard

Tarjeta de planta estilo "item de inventario RPG" con barra de vida decorativa.

```tsx
<PlantCard
  name="Monstera"
  emoji="🌿"
  description="Planta tropical"
  level="12"
  onPress={() => navigateToDetail(id)}
/>
```

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `name` | `string` | — | Nombre de la planta |
| `emoji` | `string` | `'🌱'` | Icono representativo |
| `description` | `string?` | — | Descripción corta |
| `level` | `string?` | — | Nivel RPG |
| `onPress` | `() => void?` | — | Si se pasa, la card es presionable |

### 4.3 AppText

Componente de tipografía con presets que aplican automáticamente la fuente
pixel (headings) o mono (body).

```tsx
<AppText preset="title">Mi Jardín</AppText>
<AppText preset="body">Descripción de la planta</AppText>
```

### 4.4 Card, Input, Chip, PrimaryButton

Componentes actualizados con estética retro:
- **Card:** Bordes gruesos (3px), radius bajo (4px), sombra sólida
- **Input:** Bordes 3px, fuente Courier New, labels en Press Start 2P
- **Chip:** Bordes gruesos (3px), texto en Press Start 2P 10px
- **PrimaryButton:** Bordes 3px, sombra sólida, fuente Press Start 2P

---

## 5. Pantallas

### 5.1 GardenHome (`src/screens/GardenHome/`)

- **Concepto:** Inventario de plantas estilo RPG
- **Componentes:** PlantCard, RetroButton, stats bar
- **Navegación:** PlantCard → PlantDetail (Stack push)
- **Ruta:** `app/(app)/(tabs)/index.tsx`

### 5.2 PlantDetail (`src/screens/PlantDetail/`)

- **Concepto:** Ficha técnica con estética de diálogo RPG
- **Secciones:**
  - Sprite box (emoji + nombre + nivel)
  - Caja de diálogo con descripción
  - Panel de stats con barras tipo RPG
  - Consola de consejos (terminal verde sobre negro)
  - Botones de acción (regar, foto)
- **Ruta:** `app/(app)/plant/[id].tsx`

---

## 6. Navegación

```
Root Stack
├── (auth)/
│   ├── login.tsx
│   └── register.tsx
└── (app)/
    ├── (tabs)/
    │   ├── index.tsx      → GardenHome
    │   ├── explore.tsx    → Biblioteca/Explorar
    │   └── profile.tsx    → Perfil
    └── plant/[id].tsx     → PlantDetail (Stack)
```

- **Bottom Tabs:** 3 tabs (Jardín, Explorar, Perfil) con estilo pixel art
- **Stack:** GardenHome → PlantDetail con `slide_from_right`
- **Tab bar:** Fuente Press Start 2P 8px, bordes gruesos 3px

---

## 7. Fuentes

### Instalación

```bash
npx expo install expo-font @expo-google-fonts/press-start-2p
```

### Carga en `app/_layout.tsx`

```tsx
import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';

const [fontsLoaded] = useFonts({
  PressStart2P: PressStart2P_400Regular,
});
```

La fuente se carga con `expo-font` y `SplashScreen.preventAutoHideAsync()`
mantiene la splash visible hasta que esté lista.

---

## 8. Accesibilidad

| Criterio | Implementación |
|----------|---------------|
| Contraste WCAG AA | ≥ 4.5:1 en texto sobre fondo |
| Áreas de toque | `minHeight: 48px` en botones |
| Roles semánticos | `accessibilityRole` en todos los interactivos |
| Estados | `accessibilityState.disabled`, `.busy`, `.selected` |
| Labels | `accessibilityLabel` descriptivo en botones y cards |

---

## 9. Mapa de Archivos

| Archivo | Propósito |
|---------|-----------|
| `src/theme/colors.ts` | Paleta cromática light + dark |
| `src/theme/fonts.ts` | Tipografía Press Start 2P + Courier New |
| `src/theme/spacing.ts` | Escala de espaciado base-4 |
| `src/theme/borders.ts` | Radius + border widths pixel art |
| `src/theme/types.ts` | Tipos TypeScript compartidos |
| `src/theme/light.ts` | Tema claro ensamblado |
| `src/theme/dark.ts` | Tema oscuro ensamblado |
| `src/theme/index.ts` | Punto de entrada + hooks |
| `src/theme/designSystem.ts` | Re-export compatibilidad |
| `src/components/ui/RetroButton.tsx` | Botón retro con sombra sólida |
| `src/components/ui/PlantCard.tsx` | Card planta inventario RPG |
| `src/components/ui/AppText.tsx` | Tipografía con presets pixel/mono |
| `src/components/ui/Card.tsx` | Card contenedor retro |
| `src/components/ui/Input.tsx` | Campo de texto retro |
| `src/components/ui/Chip.tsx` | Chip/tag retro |
| `src/components/ui/PrimaryButton.tsx` | Botón primario retro |
| `src/screens/GardenHome/` | Pantalla inventario RPG |
| `src/screens/PlantDetail/` | Pantalla ficha diálogo RPG |
| `app/(app)/plant/[id].tsx` | Ruta dinámica PlantDetail |
