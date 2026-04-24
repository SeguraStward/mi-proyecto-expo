# Actividad 3: API + Sincronización
**EIF411 — Desarrollo y diseño de plataformas móviles**
**Universidad Nacional, Sede Regional Brunca**
**Estudiante:** Angel Segura Ward
**Fecha de entrega:** 24/04/2026

---

## Parte 1: Investigación y Análisis

### 1.1 Módulos de la aplicación y disponibilidad offline

La aplicación **Retro Garden** está estructurada en los siguientes módulos principales:

| Módulo | Pantalla | Funciona offline? | Justificación |
|--------|----------|:-----------------:|---------------|
| Inventario de plantas | `GardenHome` | ✅ Sí | Los datos de plantas pueden cachearse localmente. El usuario necesita ver su colección en todo momento. |
| Detalle de planta | `PlantDetail` | ✅ Sí | La información ya descargada puede servirse desde caché local. Es el contenido más consultado. |
| Perfil de usuario | `UserProfile` | ✅ Parcial | Datos de perfil se pueden leer offline; cambios se sincronizan al volver la conexión. |
| Creación/edición de planta | `CreatePlantForm / EditPlantForm` | ✅ Parcial | Se puede redactar y guardar localmente; la foto se sube y la IA identifica cuando haya conexión. |
| Identificación con IA | Flujo de cámara | ❌ No | Depende de una API externa (Plant.id o similar). Sin conexión se muestra mensaje de espera y la solicitud queda en cola. |
| Autenticación | Login / Auth | ❌ No | Firebase Auth requiere conexión. Sin embargo, si la sesión ya está activa y persistida, el usuario puede seguir usando la app. |
| Subida de fotos | Firebase Storage | ❌ No | Requiere conexión. La foto se guarda localmente y se sube al recuperar la red. |

---

### 1.2 Justificación de prioridades offline

Los módulos **GardenHome** y **PlantDetail** son los de mayor prioridad offline por tres razones:

1. **UX crítica:** Un usuario que registró sus plantas espera poder consultarlas en cualquier momento, incluso sin señal. Negarle ese acceso rompería la experiencia central de la app.
2. **Frecuencia de uso:** Son las pantallas más visitadas (inventario + detalle). Perderlas offline significa que la app queda inutilizable la mayor parte del tiempo para muchos usuarios.
3. **Naturaleza de los datos:** Los datos de plantas son relativamente estables (no cambian cada segundo), lo que hace que un caché local sea fiable y no genere inconsistencias graves.

El módulo de **identificación con IA** y la **subida de fotos** son los de menor prioridad offline porque su valor depende intrínsecamente de la red: sin respuesta de la IA no hay identificación posible. La estrategia correcta es encolarlos para ejecutarse cuando vuelva la conexión.

---

### 1.3 Estrategias UX sin conexión

Para comunicar al usuario el estado de conectividad y sincronización se proponen las siguientes soluciones:

#### Banner de estado de red
Un banner no intrusivo en la parte superior de la pantalla que aparece automáticamente cuando se pierde la conexión. Desaparece solo al recuperarla. Usa `@react-native-community/netinfo` para detectar cambios en tiempo real.

```
┌─────────────────────────────────────────────────┐
│  Sin conexión — los cambios se sincronizarán    │
└─────────────────────────────────────────────────┘
```

#### Indicadores de pendiente de sincronización
Las plantas creadas o editadas offline muestran un ícono de reloj/nube junto a su nombre en el inventario hasta que se sincronizen. Esto da transparencia sin bloquear al usuario.

#### Pantalla de error con botón de reintento
Cuando una operación falla por falta de red (ej. identificación con IA), se muestra un mensaje descriptivo con un botón "Reintentar" en lugar de una pantalla en blanco o un crash.

#### Toast de sincronización exitosa
Cuando la app recupera la conexión y termina de subir los datos pendientes, muestra un toast breve: *"Tus cambios se han sincronizado"*.

#### Skeleton loaders
Mientras se cargan datos (con o sin conexión), se muestran placeholders animados en lugar de pantallas vacías, mejorando la percepción de velocidad.

---

### 1.4 Almacenamiento local — Análisis y justificación

#### Opciones evaluadas

| Solución | Tipo | Ventajas | Desventajas |
|----------|------|----------|-------------|
| **AsyncStorage** | Clave-valor | Simple, ya en uso en el proyecto (ThemeContext) | No estructurado, mal rendimiento con grandes volúmenes |
| **SQLite (expo-sqlite)** | Relacional | Consultas complejas, transacciones, índices | Mayor complejidad de setup |
| **MMKV** | Clave-valor rápido | 10x más rápido que AsyncStorage | Requiere native module, más setup |
| **WatermelonDB** | ORM reactivo offline-first | Sincronización automática, reactivo | Complejidad alta, overkill para este proyecto |

#### Decisión: expo-sqlite

**expo-sqlite** es la mejor opción para este proyecto por las siguientes razones:

1. **Estructura de datos relacional:** Las plantas tienen múltiples campos (nombre, nombre científico, fotos, cuidados, rareza, XP) y relaciones con el usuario. Una base de datos relacional modela esto naturalmente.
2. **Consultas eficientes:** Filtrar y ordenar el inventario (por rareza, por fecha, por estado de sincronización) requiere SQL, no iteración en memoria sobre JSON.
3. **Cola de sincronización:** Se puede crear una tabla `sync_queue` con las operaciones pendientes (crear/editar/eliminar planta, subir foto) que se procesan cuando vuelve la red.
4. **Nativo de Expo:** No requiere configuración adicional en `app.json`, ya está soportado en el SDK 54.
5. **Escala con el roadmap:** El sistema de XP, logros y rondas de riego planificado en `GAMIFICATION_SPEC.md` requiere persistencia estructurada que AsyncStorage no puede manejar eficientemente.

#### Información a guardar localmente

| Tabla | Campos clave | Por qué guardarla |
|-------|-------------|-------------------|
| `plants` | id, userId, commonName, scientificName, photoUri, careInfo, rarity, syncStatus | Núcleo de la app; debe estar disponible offline |
| `sync_queue` | id, operation, payload, createdAt, retries | Registrar operaciones pendientes de subir a Firebase |
| `user_profile` | id, displayName, photoUri, xp, level | Mostrar perfil sin conexión |
| `ai_identifications` | plantId, result, confidence, createdAt | Cachear resultados de IA para no repetir llamadas |

---

## Parte 2: Desarrollo Técnico

### 2.1 Despliegue del API

El backend se desplegó en **Render** como un servicio web Node.js + Express + TypeScript ubicado en [`backend/api/`](../backend/api). El endpoint `POST /api/identify` recibe una imagen en base64 y la envía a **Plant.id v3**, devolviendo una respuesta normalizada con nombre común, científico, familia, confianza, toxicidad y cuidados sugeridos en español.

**Razones de la elección de Plant.id:**
- Modelo **especializado en plantas** (no genérico como Gemini Vision).
- Devuelve **porcentaje de confianza** estructurado, requisito de la rúbrica para dar feedback al usuario.
- Plan gratuito de 100 identificaciones/mes — suficiente para demo y desarrollo.
- API REST simple, sin necesidad de redactar prompts ni parsear respuestas free-form.

La API key vive **solo en el backend** como variable de entorno (`PLANT_ID_API_KEY`). La app móvil nunca tiene acceso a ella, evitando filtraciones por reverse engineering del bundle.

**URL del API desplegado:** _[pendiente de deploy — actualizar tras subir a Render]_

### 2.2 Identificación de plantas con IA — flujo implementado

1. Usuario toca **"IDENTIFICAR CON IA"** en `CreatePlantForm`.
2. Navega como modal a `PlantCamera` (`src/screens/PlantCamera/PlantCamera.tsx`).
3. Si los permisos son `undetermined` o `denied`, se muestra `PermissionDeniedView` con botones para solicitar o abrir Configuración.
4. Cámara activa con flip frontal/trasera, flash off/on/auto, y un encuadre con instrucciones.
5. Al capturar, pasa al modo **preview** mostrando la foto con botones "IDENTIFICAR" y "TOMAR OTRA".
6. `usePlantIdentification` convierte la URI a base64 (con `expo-file-system` en nativo o `FileReader` en web) y hace `POST /api/identify` al backend.
7. La respuesta se muestra en `AIResultCard` con: nombre común y científico, **barra de confianza con porcentaje** (verde ≥75%, ámbar 45–75%, rojo <45%), familia, toxicidad y cuidados sugeridos.
8. "Usar estos datos" guarda el resultado en `identificationStore` (singleton con `useSyncExternalStore`) y vuelve al formulario, que se pre-llena automáticamente y muestra un badge "DATOS SUGERIDOS POR IA · CONFIANZA X%".

### 2.3 Gestión de permisos de cámara

La app maneja tres estados con la abstracción `PermissionService` (`src/services/permissionService.ts`):

- **`undetermined`:** se solicitan permisos automáticamente al montar `useCamera` (`requestOnMount: true`).
- **`denied`:** se muestra `PermissionDeniedView` con dos botones funcionales: "SOLICITAR PERMISOS" (reintenta el prompt nativo) y "IR A CONFIGURACION" (`Linking.openSettings()` que abre los ajustes del sistema).
- **`granted`:** se renderiza `<CameraView />` normalmente.

En ningún caso la app se bloquea o crashea. Si no se otorgan permisos, las funciones de cámara quedan deshabilitadas pero el resto del app (inventario, perfil, settings) sigue operando. El usuario puede volver a intentarlo en cualquier momento desde el botón de la pantalla.

### 2.4 Sincronización offline — implementación

| Componente | Archivo | Función |
|-----------|---------|---------|
| Detección de red | `src/hooks/useNetworkStatus.ts` | Suscripción a NetInfo, retorna `isConnected` + `isInternetReachable` |
| Banner UX | `src/components/ui/OfflineBanner.tsx` | Banner animado (Reanimated) con 3 estados: oculto, **offline rojo**, **syncing ámbar** |
| Persistencia local | `src/services/localDb.ts` | SQLite con tabla `sync_queue` (id, operation, payload JSON, status, retries, lastError) |
| Cola de sincronización | `src/services/syncService.ts` | `queueCreatePlant`, `drainQueue`, patrón observable con listeners |
| Hook de cola | `src/hooks/useSyncQueue.ts` | Observa pendingCount, dispara `drainQueue` automáticamente al recuperar conexión |
| Indicador visual | `src/components/ui/PlantCard.tsx` (prop `pending`) | Badge ámbar "PENDIENTE" en la esquina superior de la tarjeta |
| Plantas pendientes | `src/hooks/usePendingPlants.ts` | Lee `sync_queue` y devuelve plantas virtuales para mostrar en el inventario |

**Flujo offline:**
1. Sin conexión, al guardar planta → `syncService.queueCreatePlant()` la persiste en SQLite local.
2. La planta aparece **inmediatamente** en `GardenHome` como tarjeta con badge "PENDIENTE" (lee de `usePendingPlants`).
3. `OfflineBanner` muestra "SIN CONEXION — LOS CAMBIOS SE SINCRONIZARAN".
4. Al recuperar red, `useSyncQueue` detecta el cambio y dispara `drainQueue()`.
5. Banner cambia a "SINCRONIZANDO N PENDIENTES…".
6. `processItem` ejecuta `createPlant` + `uploadPlantPhoto` contra Firebase. Si falla, marca `status: error` con `retries++` para reintentar después.
7. Al completarse, la planta deja la cola y aparece desde Firestore en el siguiente refresh, sin badge.

---

## Parte 3: Repositorio y recursos

- **Repositorio:** [github.com/angelsgalaxy/retro-garden](https://github.com/angelsgalaxy/retro-garden) _(actualizar con URL real)_
- **API en Render:** _(URL pendiente de deploy)_
- **Video de demostración:** _(URL pendiente de grabación)_

---

## Referencias

- Expo Camera Docs: https://docs.expo.dev/versions/latest/sdk/camera/
- Expo SQLite Docs: https://docs.expo.dev/versions/latest/sdk/sqlite/
- Plant.id API: https://plant.id/
- React Native NetInfo: https://github.com/react-native-netinfo/react-native-netinfo
- Firebase Offline Persistence: https://firebase.google.com/docs/firestore/manage-data/enable-offline
