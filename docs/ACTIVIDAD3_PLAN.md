# Plan de implementación — Actividad 3
**EIF411 — API + Sincronización**

> Checklist paso a paso para cumplir con todos los criterios de la rúbrica.
> Marcar cada ítem con ✅ al completarlo.
>
> Estado actualizado del proyecto: **24/04/2026**.

---

## Fase 0 — Prerequisitos (ya completado)

- [x] `expo-camera` y `expo-media-library` instalados
- [x] Permisos declarados en `app.json`
- [x] `permissionService.ts` creado
- [x] `cameraService.ts` creado
- [x] `useCamera.ts` creado

---

## Fase 1 — Backend: API de identificación de plantas

### 1.1 Crear el proyecto backend
- [x] Crear carpeta `backend/` en la raíz del monorepo (estructura real: `backend/api/`)
- [x] Inicializar Node.js + Express + TypeScript:
  ```bash
  mkdir backend && cd backend
  npm init -y
  npm install express cors dotenv axios
  npm install -D typescript @types/express @types/node ts-node nodemon
  ```
- [x] Crear `backend/api/src/index.ts` con servidor Express básico (puerto 3000)
- [x] Crear `backend/api/src/routes/identify.ts` con endpoint `POST /api/identify`
- [x] El endpoint recibe `{ imageBase64: string }` y llama a Plant.id
- [x] Retornar respuesta con estructura normalizada:
  ```json
  {
    "commonName": "Monstera",
    "scientificName": "Monstera deliciosa",
    "confidence": 0.94,
    "care": { "water": "...", "light": "...", "soil": "..." },
    "isPlant": true
  }
  ```
- [x] Agregar `backend/api/.env` con `PLANT_ID_API_KEY`

### 1.2 Desplegar en Render
- [ ] Crear cuenta en render.com si no existe
- [ ] Crear nuevo **Web Service** apuntando al repo (carpeta `backend/api/`)
- [ ] Configurar variables de entorno en el dashboard de Render
- [ ] Verificar que el endpoint responda en la URL pública de Render
- [ ] Compartir acceso con `granadosdaniel566@gmail.com`
- [ ] Copiar la URL del API y agregarla como `EXPO_PUBLIC_PLANT_API_URL` en `.env`

---

## Fase 2 — Integración de IA en la app

### 2.1 Service de identificación
- [x] Crear `src/services/plantIdentificationService.ts`
  - Función de identificación implementada (entrada por `photoUri` y opcional `imageBase64`)
  - Llama al endpoint del backend (`/api/identify`)
  - Maneja errores de red/servidor y valida base64

### 2.2 Hook de identificación
- [x] Crear `src/hooks/usePlantIdentification.ts`
  - Estados: `isLoading`, `result`, `error`
  - Función `identify(uri: string)` que convierte URI → base64 y llama al service
  - Función `reset()` para limpiar el resultado

### 2.3 Pantalla de cámara
- [x] Crear `src/screens/PlantCamera/PlantCamera.tsx`
  - Usa `useCamera()` para gestionar la cámara
  - Botón de captura central
  - Botón de rotar cámara (frontal/trasera)
  - Botón de flash
  - Al tomar foto → muestra preview → botón "Identificar" → muestra resultado con confianza
  - Si no hay permisos → muestra `PermissionDeniedView` con botón para ir a configuración
- [x] Crear `app/(app)/plant/identify.tsx` como ruta para esta pantalla
- [x] Conectar la ruta desde `CreatePlantForm` (botón de cámara existente)

### 2.4 Componente de resultado de IA
- [x] Crear `src/components/ui/AIResultCard.tsx`
  - Muestra nombre común, nombre científico
  - Barra de progreso para el nivel de confianza (porcentaje)
  - Sección de cuidados básicos
  - Botones: "Usar estos datos" / "Descartar"

---

## Fase 3 — Gestión de permisos en UI

### 3.1 Componente de permisos denegados
- [x] Crear `src/components/ui/PermissionDeniedView.tsx`
  - Ilustración/ícono descriptivo
  - Texto explicando por qué se necesita el permiso
  - Botón "Solicitar permisos" → llama a `requestPermissions()`
  - Botón "Ir a Configuración" → abre settings del sistema con `Linking.openSettings()`
  - La app sigue funcionando: el botón de cámara simplemente muestra este componente

### 3.2 Integrar en el flujo de cámara
- [x] En `PlantCamera.tsx` verificar `isPermissionGranted`:
  - `false` + `undetermined` → solicitar automáticamente al montar
  - `false` + `denied` → mostrar `PermissionDeniedView`
  - `true` → mostrar `CameraView` normal

---

## Fase 4 — Sincronización offline

### 4.1 Detección de conectividad
- [x] Instalar: `npx expo install @react-native-community/netinfo`
- [x] Crear `src/hooks/useNetworkStatus.ts`
  - Retorna `{ isConnected: boolean, isInternetReachable: boolean }`
  - Se suscribe a cambios de red en tiempo real

### 4.2 Banner de estado offline
- [x] Crear `src/components/ui/OfflineBanner.tsx`
  - Banner amarillo/rojo en la parte superior con texto "Sin conexión"
  - Solo se muestra cuando `!isConnected`
  - Animación de entrada/salida con `react-native-reanimated`
- [x] Agregar `<OfflineBanner />` en el layout principal `app/(app)/_layout.tsx`

### 4.3 Indicador de pendiente de sincronización en plantas
- [ ] Agregar campo `syncStatus: 'synced' | 'pending' | 'error'` al tipo `Plant` (pendiente; se usa `sync_queue`)
- [x] Modificar `PlantCard.tsx` para mostrar estado pendiente en UI
- [x] Cuando se crea/edita una planta offline → guardar localmente como pendiente en `sync_queue`
- [x] Cuando vuelve la red → subir automáticamente pendientes
- [ ] Mostrar toast "Tus cambios se han sincronizado" al terminar

### 4.4 Almacenamiento local con expo-sqlite
- [x] Instalar: `npx expo install expo-sqlite`
- [x] Crear `src/services/localDb.ts`
  - Inicializar DB y crear tabla `sync_queue`
  - Implementar operaciones de cola (`enqueue`, `getPending`, `markInProgress`, `markCompleted`, `markError`)
  - [ ] Crear tablas `plants` y `user_profile` (pendiente)
- [x] Crear `src/services/syncService.ts`
  - `processSyncQueue()` — recorre `sync_queue` y sube pendientes a Firestore/Storage
  - Se llama automáticamente cuando `netInfo.isConnected` cambia a `true`

---

## Fase 5 — Flujo completo de agregar planta con IA

Este es el flujo completo que se evalúa en la rúbrica (25 pts):

- [ ] Usuario toca "Agregar planta" en `GardenHome`
- [x] Formulario `CreatePlantForm` tiene botón "Identificar con cámara"
- [x] Navega a `PlantCamera` → verifica permisos → abre cámara
- [x] Usuario toma foto → se muestra preview
- [x] Al confirmar → se llama `usePlantIdentification.identify(uri)`
- [x] Se muestra loading mientras la IA procesa
- [x] Se muestra `AIResultCard` con nombre, confianza y cuidados
- [x] Usuario toca "Usar estos datos" → los campos del formulario se pre-llenan
- [x] Usuario puede editar y confirma → se guarda la planta
- [x] Si hay conexión → se sube foto y se sincroniza con Firestore inmediatamente
- [x] Si no hay conexión → se guarda en cola local de sincronización (`sync_queue`)

---

## Fase 6 — Documentación y entrega

### 6.1 PDF de análisis
- [ ] Exportar `docs/ACTIVIDAD3_ANALISIS.md` a PDF
  - Usar VS Code + extensión Markdown PDF, o Pandoc, o copiar a Google Docs
- [ ] Revisar que incluya: tabla de módulos, justificación, análisis de almacenamiento, estrategias UX

### 6.2 README del repositorio
- [ ] Actualizar `README.md` con:
  - Descripción del proyecto
  - Instrucciones de instalación y ejecución
  - URL del API en Render
  - Capturas de pantalla

### 6.3 Video de demostración
Grabar un video que muestre en orden:
- [ ] Abrir la app sin permisos de cámara concedidos
- [ ] Intentar usar la cámara → ver pantalla de permisos denegados
- [ ] Solicitar los permisos → concederlos
- [ ] Tomar foto a una planta
- [ ] Ver el resultado de la IA con el nivel de confianza
- [ ] Guardar la planta en la base de datos
- [ ] Mencionar brevemente el prompt usado

### 6.4 Entrega en AV
- [ ] PDF con el análisis
- [ ] Link al repositorio de GitHub
- [ ] Link al video
- [ ] Link al API en Render

---

## Resumen de archivos a crear/modificar

| Archivo | Tipo | Fase |
|---------|------|------|
| `backend/api/src/index.ts` | Nuevo | 1 |
| `backend/api/src/routes/identify.ts` | Nuevo | 1 |
| `src/services/plantIdentificationService.ts` | Nuevo | 2 |
| `src/hooks/usePlantIdentification.ts` | Nuevo | 2 |
| `src/screens/PlantCamera/PlantCamera.tsx` | Nuevo | 2 |
| `app/(app)/plant/identify.tsx` | Nuevo | 2 |
| `src/components/ui/AIResultCard.tsx` | Nuevo | 2 |
| `src/components/ui/PermissionDeniedView.tsx` | Nuevo | 3 |
| `src/hooks/useNetworkStatus.ts` | Nuevo | 4 |
| `src/components/ui/OfflineBanner.tsx` | Nuevo | 4 |
| `src/services/localDb.ts` | Nuevo | 4 |
| `src/services/syncService.ts` | Nuevo | 4 |
| `src/types-dtos/plant.types.ts` | Modificar (pendiente) | 4 |
| `src/components/ui/PlantCard.tsx` | Modificar | 4 |
| `app/(app)/_layout.tsx` | Modificar | 4 |
| `src/screens/GardenHome/GardenHome.tsx` | Modificar | 5 |
| `src/screens/PlantDetail/CreatePlantForm.tsx` | Modificar | 5 |
| `README.md` | Modificar | 6 |

---

## Criterios de la rúbrica — checklist final

| Criterio | Pts | Implementado en |
|----------|-----|-----------------|
| Identificación de módulos offline con justificación técnica | 10 | `ACTIVIDAD3_ANALISIS.md` §1.1-1.2 |
| Justificación de prioridades (UX, negocio, uso) | 10 | `ACTIVIDAD3_ANALISIS.md` §1.2 |
| Almacenamiento local identificado y justificado | 15 | `ACTIVIDAD3_ANALISIS.md` §1.4 + `localDb.ts` |
| Estrategias UX sin conexión (banner, retry, etc.) | 5 | `ACTIVIDAD3_ANALISIS.md` §1.3 + `OfflineBanner` |
| Foto + identificación IA + feedback de confianza | 25 | Fases 2, 3 y 5 |
| API desplegada en Render | 5 | Fase 1.2 |
| Documento PDF estructurado | 10 | Fase 6.1 |
| Repositorio limpio con README | 5 | Fase 6.2 |
| Lista de pantallas con almacenamiento local | 5 | `ACTIVIDAD3_ANALISIS.md` §1.4 |
| Video de demostración completo | 10 | Fase 6.3 |
| **Total** | **100** | |
