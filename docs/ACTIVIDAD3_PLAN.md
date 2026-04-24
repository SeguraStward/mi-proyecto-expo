# Plan de implementación — Actividad 3
**EIF411 — API + Sincronización**

> Checklist paso a paso para cumplir con todos los criterios de la rúbrica.
> Marcar cada ítem con ✅ al completarlo.

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
- [ ] Crear carpeta `backend/` en la raíz del monorepo (o repo separado)
- [ ] Inicializar Node.js + Express + TypeScript:
  ```bash
  mkdir backend && cd backend
  npm init -y
  npm install express cors dotenv axios
  npm install -D typescript @types/express @types/node ts-node nodemon
  ```
- [ ] Crear `backend/src/index.ts` con servidor Express básico (puerto 3000)
- [ ] Crear `backend/src/routes/plantIdentification.ts` con endpoint `POST /api/identify`
- [ ] El endpoint recibe `{ imageBase64: string }` y llama a Plant.id o Gemini Vision
- [ ] Retornar respuesta con estructura:
  ```json
  {
    "commonName": "Monstera",
    "scientificName": "Monstera deliciosa",
    "confidence": 0.94,
    "care": { "water": "...", "light": "...", "soil": "..." },
    "isPlant": true
  }
  ```
- [ ] Agregar `backend/.env` con `PLANT_ID_API_KEY` o `GEMINI_API_KEY`

### 1.2 Desplegar en Render
- [ ] Crear cuenta en render.com si no existe
- [ ] Crear nuevo **Web Service** apuntando al repo (carpeta `backend/`)
- [ ] Configurar variables de entorno en el dashboard de Render
- [ ] Verificar que el endpoint responda en la URL pública de Render
- [ ] Compartir acceso con `granadosdaniel566@gmail.com`
- [ ] Copiar la URL del API y agregarla como `EXPO_PUBLIC_PLANT_API_URL` en `.env`

---

## Fase 2 — Integración de IA en la app

### 2.1 Service de identificación
- [ ] Crear `src/services/plantIdentificationService.ts`
  - Función `identifyPlant(imageBase64: string): Promise<PlantIdentificationResult>`
  - Llama al endpoint del backend desplegado en Render
  - Maneja errores de red y retorna null si no hay conexión

### 2.2 Hook de identificación
- [ ] Crear `src/hooks/usePlantIdentification.ts`
  - Estados: `isLoading`, `result`, `error`
  - Función `identify(uri: string)` que convierte URI → base64 y llama al service
  - Función `reset()` para limpiar el resultado

### 2.3 Pantalla de cámara
- [ ] Crear `src/screens/PlantCamera/PlantCamera.tsx`
  - Usa `useCamera()` para gestionar la cámara
  - Botón de captura central
  - Botón de rotar cámara (frontal/trasera)
  - Botón de flash
  - Al tomar foto → muestra preview → botón "Identificar" → muestra resultado con confianza
  - Si no hay permisos → muestra `PermissionDeniedView` con botón para ir a configuración
- [ ] Crear `app/(app)/plant-camera.tsx` como ruta para esta pantalla
- [ ] Conectar la ruta desde `CreatePlantForm` (botón de cámara existente)

### 2.4 Componente de resultado de IA
- [ ] Crear `src/components/ui/AIResultCard.tsx`
  - Muestra nombre común, nombre científico
  - Barra de progreso para el nivel de confianza (porcentaje)
  - Sección de cuidados básicos
  - Botones: "Usar estos datos" / "Descartar"

---

## Fase 3 — Gestión de permisos en UI

### 3.1 Componente de permisos denegados
- [ ] Crear `src/components/ui/PermissionDeniedView.tsx`
  - Ilustración/ícono descriptivo
  - Texto explicando por qué se necesita el permiso
  - Botón "Solicitar permisos" → llama a `requestPermissions()`
  - Botón "Ir a Configuración" → abre settings del sistema con `Linking.openSettings()`
  - La app sigue funcionando: el botón de cámara simplemente muestra este componente

### 3.2 Integrar en el flujo de cámara
- [ ] En `PlantCamera.tsx` verificar `isPermissionGranted`:
  - `false` + `undetermined` → solicitar automáticamente al montar
  - `false` + `denied` → mostrar `PermissionDeniedView`
  - `true` → mostrar `CameraView` normal

---

## Fase 4 — Sincronización offline

### 4.1 Detección de conectividad
- [ ] Instalar: `npx expo install @react-native-community/netinfo`
- [ ] Crear `src/hooks/useNetworkStatus.ts`
  - Retorna `{ isConnected: boolean, isInternetReachable: boolean }`
  - Se suscribe a cambios de red en tiempo real

### 4.2 Banner de estado offline
- [ ] Crear `src/components/ui/OfflineBanner.tsx`
  - Banner amarillo/rojo en la parte superior con texto "Sin conexión"
  - Solo se muestra cuando `!isConnected`
  - Animación de entrada/salida con `react-native-reanimated`
- [ ] Agregar `<OfflineBanner />` en el layout principal `app/(app)/_layout.tsx`

### 4.3 Indicador de pendiente de sincronización en plantas
- [ ] Agregar campo `syncStatus: 'synced' | 'pending' | 'error'` al tipo `Plant`
- [ ] Modificar `PlantCard.tsx` para mostrar ícono de reloj cuando `syncStatus === 'pending'`
- [ ] Cuando se crea/edita una planta offline → guardar localmente con `syncStatus: 'pending'`
- [ ] Cuando vuelve la red → subir automáticamente y cambiar a `syncStatus: 'synced'`
- [ ] Mostrar toast "Tus cambios se han sincronizado" al terminar

### 4.4 Almacenamiento local con expo-sqlite
- [ ] Instalar: `npx expo install expo-sqlite`
- [ ] Crear `src/services/localDb.ts`
  - Inicializar DB y crear tablas: `plants`, `sync_queue`, `user_profile`
  - Funciones CRUD locales: `savePlantLocally`, `getLocalPlants`, `updatePlantSync`
- [ ] Crear `src/services/syncService.ts`
  - `processSyncQueue()` — recorre `sync_queue` y sube pendientes a Firestore/Storage
  - Se llama automáticamente cuando `netInfo.isConnected` cambia a `true`

---

## Fase 5 — Flujo completo de agregar planta con IA

Este es el flujo completo que se evalúa en la rúbrica (25 pts):

- [ ] Usuario toca "Agregar planta" en `GardenHome`
- [ ] Formulario `CreatePlantForm` tiene botón "Identificar con cámara"
- [ ] Navega a `PlantCamera` → verifica permisos → abre cámara
- [ ] Usuario toma foto → se muestra preview
- [ ] Al confirmar → se llama `usePlantIdentification.identify(uri)`
- [ ] Se muestra loading mientras la IA procesa
- [ ] Se muestra `AIResultCard` con nombre, confianza y cuidados
- [ ] Usuario toca "Usar estos datos" → los campos del formulario se pre-llenan
- [ ] Usuario puede editar y confirma → se guarda la planta
- [ ] Si hay conexión → se sube foto y se sincroniza con Firestore inmediatamente
- [ ] Si no hay conexión → se guarda localmente con `syncStatus: 'pending'`

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
| `backend/src/index.ts` | Nuevo | 1 |
| `backend/src/routes/plantIdentification.ts` | Nuevo | 1 |
| `src/services/plantIdentificationService.ts` | Nuevo | 2 |
| `src/hooks/usePlantIdentification.ts` | Nuevo | 2 |
| `src/screens/PlantCamera/PlantCamera.tsx` | Nuevo | 2 |
| `app/(app)/plant-camera.tsx` | Nuevo | 2 |
| `src/components/ui/AIResultCard.tsx` | Nuevo | 2 |
| `src/components/ui/PermissionDeniedView.tsx` | Nuevo | 3 |
| `src/hooks/useNetworkStatus.ts` | Nuevo | 4 |
| `src/components/ui/OfflineBanner.tsx` | Nuevo | 4 |
| `src/services/localDb.ts` | Nuevo | 4 |
| `src/services/syncService.ts` | Nuevo | 4 |
| `src/types-dtos/plant.types.ts` | Modificar | 4 |
| `src/components/ui/PlantCard.tsx` | Modificar | 4 |
| `app/(app)/_layout.tsx` | Modificar | 4 |
| `src/screens/GardenHome/GardenHome.tsx` | Modificar | 5 |
| `src/components/customs/CreatePlantForm.tsx` | Modificar | 5 |
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
