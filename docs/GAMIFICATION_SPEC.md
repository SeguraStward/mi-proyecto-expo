# Especificación: App Gamificada de Cuidado de Plantas
**Estilo:** Stardew Valley / RPG Pixel Art
**Estado:** Pendiente de implementación
**Fecha:** 2026-03-11
**Design system base:** Retro Garden Design System (RGDS v1.0)

---

## Concepto central

App gamificada de **inventario, identificación y cuidado de plantas** donde el usuario gestiona su colección como si fuera un granjero en un RPG. Cada planta tiene nivel, estadísticas y un ciclo de vida. Cuidarlas bien otorga XP, sube el nivel del jardín y desbloquea logros.

---

## Estructura de navegación (4 tabs)

| Tab | Ícono | Nombre en pantalla | Ruta |
|-----|-------|-------------------|------|
| 1 | 🌿 | **El Invernadero** | `/(app)/(tabs)/` |
| 2 | 🔍 | **Herbario** | `/(app)/(tabs)/herbario` |
| 3 | 🌱 | **Mi Jardín** | `/(app)/(tabs)/jardin` |
| 4 | 👤 | **Granjero** | `/(app)/(tabs)/profile` |

> El tab actual `index.tsx` (GardenHome) pasa a ser "El Invernadero".
> El tab `explore.tsx` se renombra/reemplaza con "Herbario".
> Se agrega un nuevo tab "Mi Jardín" para la colección completa.

---

## Tab 1: El Invernadero (riego diario)

Núcleo de la experiencia diaria. El usuario ve qué plantas necesitan atención hoy.

### 1.1 Vista de entrada — Daily Overview

**Header:**
- Título pixel art: `"— EL INVERNADERO —"`
- Subtítulo dinámico: `"Buenos días, Granjero!"` + fecha estilo in-game (`"Día 42 · Primavera"`)
- La estación se deriva de la fecha real del dispositivo

**Cuerpo:**
- Contador de plantas pendientes: `"3 plantas necesitan atención hoy"`
- Barra de progreso gamificada: `[██░░░░] 1/3 regadas` con animación de llenado (Reanimated)
- Si no hay plantas pendientes: mensaje de celebración `"¡Jardín al día! 🎉"` + tiempo hasta próximo riego

**CTA:**
- Botón `[INICIAR RONDA DE RIEGO]` (RetroButton filled, grande)
- Si 0 pendientes: botón `[VER MI JARDÍN]`

---

### 1.2 Modo Riego — Card Swiper (una planta a la vez)

Presenta una planta por vez en tarjeta grande estilo carta RPG.

**Componente:** `PlantCareCard`

**Contenido de la tarjeta:**
- Imagen/sprite de la planta con animación idle (bob up-down suave, loop infinito, Reanimated)
- Badge de rareza (`RarityBadge`) en esquina superior derecha
- Nombre común + nombre científico (AppText presets)
- Barra de sed estilo RPG (`ProgressBar`): va de verde (hidratada) a rojo (sedienta)
- Días desde último riego: `"Hace 3 días"` o `"Hoy"` etc.
- Caja de diálogo estilo Stardew (fondo oscuro, borde pixel, tipografía Courier): tip de cuidado del día
- Nivel actual de la planta + XP hasta próximo nivel

**Acciones (3 botones):**

| Botón | Variante | Acción |
|-------|----------|--------|
| `[💧 REGAR]` | RetroButton filled | Registra riego, anima tarjeta, otorga XP |
| `[→ DESPUÉS]` | RetroButton outlined | Pospone 1 día, swipe-out con animación |
| `[👁 VER]` | PrimaryButton outlined small | Navega a `plant/[id]` |

**Contador de progreso:**
- Indicador encima de la tarjeta: `"2 / 5"` con puntos o paginación pixel art

---

### 1.3 Animación de riego (flujo detallado)

Disparada al presionar `[REGAR]`:

1. **Shake** de la tarjeta: pequeña vibración horizontal (Reanimated `withSequence`)
2. **Gotitas** animadas: 3-5 gotas de agua (emoji 💧 o SVG) caen desde la parte superior de la tarjeta hacia la imagen de la planta (`withTiming` + `withDelay`)
3. **Barra de sed** se llena de izquierda a derecha con `withTiming` (duración 600ms)
4. **Flash de XP flotante** (`XPFloatingLabel`): texto `"+15 XP ✨"` aparece en el centro, sube y se desvanece (`withSpring` + `withTiming` opacity)
5. **Vibración haptica**: `Haptics.notificationAsync(SUCCESS)` en el momento del riego
6. **Slide-out**: la tarjeta sale por la izquierda (`withTiming` translateX) mientras la siguiente entra por la derecha

**Duración total de la secuencia:** ~1200ms

---

### 1.4 Pantalla de fin de ronda — `RoundCompleteModal`

Se muestra cuando todas las plantas de la ronda fueron atendidas.

**Contenido:**
- Título: `"¡RONDA COMPLETADA!"` (Press Start 2P, grande)
- Animación de celebración: estrellas/partículas pixel art animadas con Reanimated (o Skia si se instala)
- Resumen de sesión:
  - XP total ganado en la ronda
  - Plantas regadas hoy
  - Racha de días consecutivos (`StreakBadge`)
  - Bonus de racha si aplica
- CTA: `[VER MI JARDÍN]`

---

## Tab 2: Herbario (enciclopedia + identificación)

### 2.1 Identificación por foto

**FAB flotante** (`IdentifyFAB`): botón circular con ícono de cámara, posicionado abajo a la derecha.

**Flujo:**
1. Usuario presiona FAB → expo-image-picker se abre (cámara o galería)
2. Foto tomada → llamada a API de identificación (Plant.id API o similar)
3. Pantalla de carga con animación pixel art (spinner o plant que crece)
4. Resultado muestra:
   - Nombre común + científico
   - Imagen de referencia
   - Ciclo de riego recomendado (días)
   - Nivel de dificultad (⭐ a ⭐⭐⭐⭐⭐)
   - Rareza sugerida
   - Curiosidades (1-2 líneas en caja de diálogo estilo Stardew)
5. Botón `[AGREGAR A MI JARDÍN]` → animación de tarjeta que "vuela" hacia tab Mi Jardín

### 2.2 Enciclopedia

- Lista/grid de todas las plantas identificadas históricamente
- Filtros por rareza, familia, dificultad (componente `Chip` existente)
- Búsqueda por nombre
- Cada entrada muestra: imagen, nombre, rareza, # de veces en el jardín

---

## Tab 3: Mi Jardín (colección completa)

- Grid 2 columnas de todas las plantas del usuario (componente `PlantCard` existente + mejoras)
- Cada tarjeta muestra: imagen, nombre, nivel, días hasta próximo riego, badge de rareza
- Filtros: todas / pendientes hoy / por rareza
- FAB para agregar planta manualmente (sin identificación)
- Tap en planta → PlantDetail screen (ya existe, mejorar con datos de riego)

---

## Tab 4: Granjero (perfil + logros)

Mejoras sobre el `UserProfile` existente:

- **Stats principales:** nivel de granjero, XP total, racha actual, plantas totales
- **Barra de XP** hacia siguiente nivel (ProgressBar)
- **Logros desbloqueados** (grid de medallas con `AchievementToast` al desbloquear nuevos)
- **Historial de actividad** (últimas 7 acciones de riego)
- Theme toggle (ya existe)

---

## Gamificación — Sistema completo

### XP y Niveles

| Acción | XP |
|--------|----|
| Regar planta (común) | +10 XP |
| Regar planta (poco común) | +15 XP |
| Regar planta (rara) | +25 XP |
| Regar planta (épica) | +40 XP |
| Completar ronda diaria | +50 XP bonus |
| Racha de 7 días | +100 XP bonus |
| Identificar planta nueva | +30 XP |
| Agregar planta al jardín | +20 XP |

### Niveles del Granjero

| Nivel | Nombre | XP requerido |
|-------|--------|-------------|
| 1 | Aprendiz | 0 |
| 2 | Jardinero | 200 |
| 3 | Cultivador | 500 |
| 4 | Botánico | 1000 |
| 5 | Guardián del Bosque | 2000 |
| 6-10 | ... | escalar x2 |
| 10 | Maestro Botánico | 20000 |

### Sistema de Rareza de Plantas

| Rareza | Color | XP multiplicador |
|--------|-------|-----------------|
| Común | Gris `#9E9E9E` | x1 |
| Poco común | Verde `#4CAF50` | x1.5 |
| Rara | Azul `#2196F3` | x2.5 |
| Épica | Dorado `#FFD700` | x4 |

### Logros (lista inicial)

| ID | Nombre | Condición |
|----|--------|-----------|
| `first_water` | Primera Gota | Regar 1 planta |
| `streak_3` | Constante | 3 días seguidos |
| `streak_7` | Dedicado | 7 días seguidos |
| `streak_30` | Maestro Jardinero | 30 días seguidos |
| `plants_5` | Mini Jardín | 5 plantas en colección |
| `plants_20` | Gran Jardín | 20 plantas en colección |
| `rare_found` | Especie Rara | Agregar primera planta rara |
| `epic_found` | Tesoro Botánico | Agregar primera planta épica |
| `identify_10` | Explorador | Identificar 10 plantas |
| `level_5` | Guardián | Llegar a nivel 5 |

---

## Modelo de datos

### Plant

```typescript
interface Plant {
  id: string
  name: string
  scientificName: string
  imageUri?: string
  rarity: 'common' | 'uncommon' | 'rare' | 'epic'
  level: number
  xp: number
  xpToNextLevel: number
  wateringFrequencyDays: number  // cada cuántos días regar
  lastWateredAt: string          // ISO date string
  nextWateringAt: string         // calculado al guardar
  isDueToday: boolean            // derivado en runtime
  careHistory: CareEvent[]
  notes?: string
  identifiedAt?: string
  addedAt: string
}
```

### CareEvent

```typescript
interface CareEvent {
  id: string
  plantId: string
  type: 'water' | 'fertilize' | 'repot' | 'prune'
  performedAt: string    // ISO date string
  xpEarned: number
  notes?: string
}
```

### UserProfile

```typescript
interface UserProfile {
  id: string
  name: string
  handle: string
  avatarUri?: string
  level: number
  xp: number
  xpToNextLevel: number
  currentStreak: number
  longestStreak: number
  lastActiveDate: string
  achievements: string[]   // achievement IDs desbloqueados
  totalPlantsWatered: number
  totalPlantsAdded: number
  themeMode: 'light' | 'dark'
  joinedAt: string
}
```

---

## Componentes nuevos a crear

| Componente | Archivo | Descripción |
|-----------|---------|-------------|
| `PlantCareCard` | `src/components/ui/PlantCareCard.tsx` | Tarjeta grande RPG con sprite animado, barra de sed, diálogo, acciones |
| `XPFloatingLabel` | `src/components/ui/XPFloatingLabel.tsx` | Label "+15 XP" que flota y desaparece (Reanimated) |
| `ProgressBar` | `src/components/ui/ProgressBar.tsx` | Barra de vida/progreso estilo RPG con animación |
| `StreakBadge` | `src/components/ui/StreakBadge.tsx` | Badge de racha diaria |
| `RarityBadge` | `src/components/ui/RarityBadge.tsx` | Chip de rareza con color según nivel |
| `RoundCompleteModal` | `src/components/ui/RoundCompleteModal.tsx` | Pantalla de celebración con confetti/estrellas |
| `SeasonalHeader` | `src/components/ui/SeasonalHeader.tsx` | Header que cambia según estación real |
| `IdentifyFAB` | `src/components/ui/IdentifyFAB.tsx` | Botón flotante de cámara con animación |
| `AchievementToast` | `src/components/ui/AchievementToast.tsx` | Notificación de logro (slide-in desde arriba) |
| `DailyProgressBar` | `src/components/ui/DailyProgressBar.tsx` | Barra global de progreso de ronda diaria |

---

## Herramientas de animación — 100% compatibles con Expo

| Herramienta | Versión instalada | Uso |
|-------------|------------------|-----|
| `react-native-reanimated` | ✅ v4.1.1 | Base de todas las animaciones |
| `expo-haptics` | ✅ v15.0.8 | Feedback táctil en riego y logros |
| `expo-linear-gradient` | ✅ v15.0.8 | Fondos de tarjetas, barras de progreso |
| `expo-image` | ✅ v3.0.11 | Imágenes optimizadas de plantas |
| `expo-image-picker` | ✅ v17.0.10 | Cámara para identificación |
| `react-native-gesture-handler` | verificar | Swipe de tarjetas (incluido en Expo) |
| `@react-native-async-storage/async-storage` | ✅ v2.2.0 | Persistencia local de datos |

**Opcionales a instalar:**
- `@shopify/react-native-skia` — partículas pixel art y confetti avanzado (verificar compatibilidad Expo SDK 54)
- `react-native-reanimated-carousel` — swiper de tarjetas con gestos

---

## Orden de implementación sugerido

1. **Modelo de datos + contexto** — `PlantContext`, tipos TypeScript, datos mock
2. **Tab "El Invernadero"** — Daily Overview screen + `DailyProgressBar`
3. **`PlantCareCard`** — Componente base sin animaciones
4. **Animaciones de riego** — Secuencia completa con Reanimated
5. **`XPFloatingLabel` + `ProgressBar` + `RarityBadge`** — Componentes de soporte
6. **`RoundCompleteModal`** — Celebración de fin de ronda
7. **Sistema XP/niveles** — Lógica de gamificación
8. **`AchievementToast` + logros** — Sistema de logros
9. **Tab "Mi Jardín"** — Grid mejorado con nuevos datos
10. **Tab "Herbario"** — `IdentifyFAB` + enciclopedia
11. **Tab "Granjero"** — Mejoras al perfil existente
12. **`SeasonalHeader`** — Detalle visual estacional
13. **Persistencia completa** — AsyncStorage para todos los datos
14. **Integración API identificación** — Plant.id o alternativa

---

*Documento generado el 2026-03-11. Design system base: RGDS v1.0 — ver `docs/DESIGN_SYSTEM_RETRO.md`*
