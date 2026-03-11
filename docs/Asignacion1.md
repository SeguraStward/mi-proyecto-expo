# Retro Garden — Documentación de Archivos del Proyecto

## Descripción General
Aplicación móvil de identificación y mantenimiento de plantas construida con **Expo + React Native + TypeScript**. Implementa un **Retro Garden Design System** con estética pixel art 8-bit/16-bit, fuente Press Start 2P, bordes gruesos y sombras sólidas.

---

## Estructura de Archivos y Propósito de Cada Uno

### `/docs/` — Documentación del proyecto

| Archivo | Propósito |
|---------|-----------|
| [INVESTIGACION.md](INVESTIGACION.md) | Investigación de apps referentes (PlantNet, PictureThis). Análisis de patrones UI/UX. |
| [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) | Especificación del DS original (actualmente reemplazado por Retro Garden DS). |
| [DESIGN_SYSTEM_RETRO.md](DESIGN_SYSTEM_RETRO.md) | **Especificación completa del Retro Garden DS:** tokens, componentes, pantallas, navegación, accesibilidad. |
| [ARCHIVOS.md](ARCHIVOS.md) | Este archivo. Índice de documentación de cada archivo del proyecto. |

---

### `/src/theme/` — Tokens modulares del Retro Garden DS

| Archivo | Propósito |
|---------|-----------|
| `colors.ts` | Paleta cromática "Retro Garden" con light/dark. Primary #38B000, background crema #F1F8E9, sombra sólida #1A1A1A. Exporta `ThemeColors`, `lightColors`, `darkColors`. |
| `fonts.ts` | Tipografía pixel art. Press Start 2P para headings, Courier New para body. Tamaños reducidos (hero:24, body:12). Exporta `ThemeTypography`, `sharedTypography`, `PIXEL_FONT`, `MONO_FONT`. |
| `spacing.ts` | Escala de espaciado base-4 (xs:4 a 5xl:48). Exporta `ThemeSpacing`, `sharedSpacing`. |
| `borders.ts` | Radius pixel art (0-8px) y border widths tipo sprite (1-4px). Exporta `ThemeRadius`, `ThemeBorderWidths`, `sharedRadius`, `sharedBorderWidths`. |
| `types.ts` | Tipos TypeScript compartidos: `AppTheme`, `ThemeMode`, `ThemeShadow`, `ThemeElevation`. Evita dependencias circulares. |
| `light.ts` | Tema claro "Retro Forest Day" ensamblado con todos los tokens modulares. Sombras sólidas (shadowRadius:0). |
| `dark.ts` | Tema oscuro "Retro Forest Night" ensamblado. |
| `index.ts` | **Punto de entrada unificado.** Re-exporta tipos, tokens, temas y hooks (`useAppTheme`, `getAppTheme`). |
| `designSystem.ts` | Re-exportación de compatibilidad (deprecated). Redirige a `index.ts`. |

---

### `/src/components/ui/` — Componentes reutilizables del Retro Garden DS

| Archivo | Propósito |
|---------|-----------|
| `RetroButton.tsx` | **Botón pixel art.** Sombra sólida, efecto "push" al presionar (translateX/Y +3px). Variantes filled/outlined. Borde grueso 3px, radius 2px. Press Start 2P. |
| `PlantCard.tsx` | **Tarjeta planta RPG.** Item de inventario con emoji en slot, barra de vida decorativa, nivel. Presionable para navegación a detalle. |
| `AppText.tsx` | **Tipografía.** 7 presets. Hero/title/subtitle usan Press Start 2P; body/caption usan Courier New. Tamaños pixel-friendly. |
| `PrimaryButton.tsx` | **Botón primario retro.** Bordes 3px, sombra sólida, Press Start 2P 11px. |
| `Input.tsx` | **Campo de texto retro.** Bordes 3px, labels en Press Start 2P 10px, Courier New para texto. |
| `Card.tsx` | **Tarjeta contenedora retro.** Bordes gruesos 3px, radius 4px, sombra sólida. |
| `Chip.tsx` | **Chip retro.** Bordes gruesos 3px, Press Start 2P 10px, mayúsculas. |
| `index.ts` | Barrel export de todos los componentes (AppText, Card, Chip, Input, Button, RetroButton, PlantCard). |

---

### `/src/screens/` — Pantallas extraídas

| Archivo | Propósito |
|---------|-----------|
| `GardenHome/GardenHome.tsx` | **Inventario RPG.** Lista FlatList de PlantCard, header pixel art, stats bar (plantas/raras/nivel), CTA "Nueva Planta". Navega a PlantDetail via Stack push. |
| `GardenHome/index.ts` | Re-exporta GardenHome. |
| `PlantDetail/PlantDetail.tsx` | **Ficha RPG.** Sprite box, caja de diálogo con descripción, panel de stats con barras, consola de consejos (terminal verde/negro), botones de acción. |
| `PlantDetail/index.ts` | Re-exporta PlantDetail. |
| `UserProfile/UserProfile.tsx` | Perfil de usuario con avatar, stats, categorías. |
| `UserProfile/UserProfile.styles.ts` | Estilos del perfil. |
| `UserProfile/index.ts` | Re-exporta UserProfile. |

---

### `/app/(app)/(tabs)/` — Pantallas principales (Bottom Tabs)

| Archivo | Propósito |
|---------|-----------|
| `_layout.tsx` | **Layout de tabs retro.** Bottom Tabs con Press Start 2P 8px, bordes gruesos 3px. 3 tabs: Jardín, Explorar, Perfil. |
| `index.tsx` | **Tab Jardín.** Renderiza GardenHome (inventario RPG) con SafeAreaView. |
| `explore.tsx` | **Tab Explorar.** Biblioteca de plantas con buscador, filtros por dificultad, catálogo. Usa componentes retro-fied del DS. |
| `profile.tsx` | **Tab Perfil.** Renderiza UserProfile. |

---

### `/app/(app)/plant/` — Ruta dinámica PlantDetail

| Archivo | Propósito |
|---------|-----------|
| `[id].tsx` | Ruta dinámica que renderiza PlantDetail. Recibe params via expo-router searchParams. SafeAreaView con fondo del tema. |

---

### `/app/(auth)/` — Pantallas de autenticación

| Archivo | Propósito |
|---------|-----------|
| `_layout.tsx` | Layout de auth. Stack Navigator para login → register. |
| `login.tsx` | LoginScreen retro. Input (PS2P labels), PrimaryButton retro, links Courier New. |
| `register.tsx` | RegisterScreen retro. Misma estética que login. |

---

### `/app/` — Layouts raíz

| Archivo | Propósito |
|---------|-----------|
| `_layout.tsx` | **Root Layout.** ThemeProvider, carga Press Start 2P con `useFonts()` + SplashScreen. Stack con grupos `(auth)` y `(app)`. |

---

## Diagrama de Navegación

```
RootStack (Stack Navigator) — app/_layout.tsx
├── (auth) — Stack Navigator — app/(auth)/_layout.tsx
│   ├── login — app/(auth)/login.tsx
│   └── register — app/(auth)/register.tsx
└── (app) — Stack Navigator — app/(app)/_layout.tsx
    ├── (tabs) — Bottom Tab Navigator — app/(app)/(tabs)/_layout.tsx
    │   ├── index (Jardín) — GardenHome (inventario RPG)
    │   ├── explore (Explorar) — Biblioteca de plantas
    │   └── profile (Perfil) — Perfil de usuario
    └── plant/[id] — PlantDetail (ficha RPG con Stack push)
```

## Flujo del Retro Garden Design System

```
src/theme/ (modular)
├── colors.ts    ─┐
├── fonts.ts     ─┤
├── spacing.ts   ─┼→ types.ts (AppTheme interface)
├── borders.ts   ─┘     ↓
├── light.ts ←───── ensambla tema light
├── dark.ts ←────── ensambla tema dark
└── index.ts ←───── re-exporta todo + useAppTheme() hook
       ↓
   Componentes UI
   ├── RetroButton   → sombra sólida, push effect
   ├── PlantCard     → inventario RPG, barra HP
   ├── AppText       → PS2P (headings) / Courier (body)
   ├── Card          → bordes 3px, sombra sólida
   ├── Input         → bordes 3px, PS2P labels
   ├── Chip          → PS2P 10px, mayúsculas
   └── PrimaryButton → bordes 3px, sombra sólida
       ↓
   Pantallas
   ├── GardenHome   → inventario plantas RPG
   ├── PlantDetail  → ficha diálogo + stats + consola
   ├── Explore      → biblioteca con búsqueda
   ├── Login/Register → auth retro
   └── Profile      → perfil usuario
```

## Criterios de Accesibilidad Implementados

| Criterio | Implementación |
|----------|----------------|
| Contraste ≥ 4.5:1 | `#1A1A1A` sobre `#F1F8E9` = 14.5:1 |
| Áreas de toque ≥ 48px | RetroButton, PrimaryButton (minHeight: 48), Chip (minHeight: 44) |
| Labels de accesibilidad | `accessibilityLabel` en botones, inputs, cards, tabs |
| Roles semánticos | `accessibilityRole` en button, link, text, list |
| Estados | `accessibilityState` para disabled, busy, selected |
| Fuente legible | Courier New para body (12px+), Press Start 2P para headings |
