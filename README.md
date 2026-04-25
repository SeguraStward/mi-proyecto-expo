# Retro Garden

App móvil de inventario de plantas con estética RPG/pixel art (Stardew Valley). Permite registrar tus plantas, identificarlas con IA a través de la cámara, y sincronizar los datos con Firebase incluso sin conexión.

**Estudiante:** Angel Segura Ward
**Curso:** EIF411 — Desarrollo y diseño de plataformas móviles
**Universidad Nacional, Sede Regional Brunca**

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | Expo SDK 54 + React Native 0.81.5 |
| Lenguaje | TypeScript 5.9 |
| Navegación | Expo Router 6 (file-based, Stack + Tabs) |
| Base de datos | Firebase Firestore |
| Almacenamiento de archivos | Firebase Storage |
| Auth | Firebase Authentication (Google OAuth) |
| Almacenamiento local | expo-sqlite (sync queue offline) |
| Cámara | expo-camera + expo-image-picker |
| Identificación IA | Google Gemini (`gemini-1.5-flash`, vía backend en Render) |
| Backend | Node.js + Express + TypeScript |
| Animaciones | react-native-reanimated v4 |
| UI | Design system propio con `useAppTheme()` |

---

## Instalación y ejecución

```bash
# 1. Clonar el repositorio
git clone https://github.com/SeguraStward/mi-proyecto-expo.git
cd mi-proyecto-expo

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con las credenciales de Firebase y la URL del API

# 4. Iniciar la app
npx expo start
```

Luego escanear el QR con **Expo Go** en Android o iOS.

Si hay problemas de red, usar modo túnel:
```bash
npx expo start --tunnel --clear
```

---

## Variables de entorno

Copiar `.env.example` a `.env` y completar:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=

EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=

# URL del backend de identificacion (Render)
EXPO_PUBLIC_PLANT_API_URL=https://mi-proyecto-expo.onrender.com
```

---

## Backend — API de identificación de plantas

El backend está en `backend/api/`. Es un servidor Express que actúa como proxy entre la app y **Google Gemini** (`gemini-1.5-flash`), para que la API key nunca quede expuesta en el bundle móvil. Soporta también Plant.id como provider alternativo (configurable vía `AI_PROVIDER`).

```bash
cd backend/api
npm install
cp .env.example .env   # agregar GEMINI_API_KEY
npm run dev            # desarrollo local (puerto 3000)
```

Instrucciones de deploy en Render: [backend/api/README.md](backend/api/README.md).

**URL del API en Render:** https://mi-proyecto-expo.onrender.com
**Endpoint de identificación:** `POST /api/identify` con body `{ "imageBase64": "..." }`

---

## Funcionalidades principales

### Inventario de plantas (GardenHome)
- Grid 2 columnas con foto, nombre y nombre científico
- Estadísticas de jardín: total, plantas que necesitan agua, racha máxima
- Pull-to-refresh desde Firestore

### Identificación con IA (Google Gemini)
1. Botón "IDENTIFICAR CON IA" en el formulario "Nueva Planta"
2. Cámara con flip frontal/trasera y control de flash
3. Preview de la foto antes de enviar
4. La foto se envía como base64 al backend → backend llama a `gemini-1.5-flash` con un prompt en español que pide JSON estructurado
5. Resultado con nombre común, científico, familia, **barra de confianza %** (verde ≥75 / ámbar 45–75 / rojo <45), toxicidad y cuidados sugeridos
6. "Usar estos datos" pre-llena el formulario y muestra badge con porcentaje de confianza

### Foto sin IA (offline-friendly)
Aparte del flujo con IA, el botón "AGREGAR FOTO" abre un menú con dos opciones offline: **Cámara** (`launchCameraAsync`) y **Galería** (`launchImageLibraryAsync`). Ninguna requiere red — la foto se sube cuando vuelva la conexión.

### Funcionamiento offline
- Plantas creadas sin conexión se guardan en SQLite (`sync_queue`)
- Aparecen en el inventario con badge **"PENDIENTE"** hasta sincronizarse
- Banner animado indica estado: offline (rojo) / sincronizando (ámbar)
- Al recuperar la red la cola se drena automáticamente en segundo plano

### Gestión de permisos de cámara
- Permisos denegados → pantalla informativa con "Solicitar permisos" y "Ir a Configuración"
- La app sigue operativa sin cámara en todo momento

---

## Estructura del proyecto

```
app/                         # Rutas Expo Router
├── (auth)/                  # Login / registro
└── (app)/
    ├── (tabs)/              # Tabs: GardenHome, Explore, Perfil
    └── plant/               # Detalle, nueva planta, editar, cámara IA

src/
├── components/ui/           # Design system: PlantCard, AIResultCard, OfflineBanner...
├── context/                 # ThemeContext, AuthContext, ToastContext
├── hooks/                   # useCamera, usePlantIdentification, useNetworkStatus,
│                            # useSyncQueue, usePendingPlants...
├── screens/                 # GardenHome, PlantCamera, UserProfile...
├── services/                # firestore, cameraService, permissionService,
│                            # plantIdentificationService, localDb, syncService
├── stores/                  # identificationStore
└── types-dtos/              # PlantDocument, UserDocument, identification.types...

backend/
├── api/                     # Servidor Express (deploy en Render)
└── firebase_seed/           # Seed de Firestore (Python)

docs/
├── ACTIVIDAD3_ANALISIS.md   # Análisis offline + almacenamiento (Actividad 3)
├── ACTIVIDAD3_PLAN.md       # Plan de implementación
└── GAMIFICATION_SPEC.md     # Spec RPG: XP, logros, rareza
```

---

## Firebase Seed

Para poblar Firestore con datos iniciales:

```bash
cd backend/firebase_seed
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python seed_firestore.py --credentials ./serviceAccountKey.json
```

---

## Entrega Actividad 3

| Recurso | Enlace |
|---------|--------|
| Documento de análisis | [docs/ACTIVIDAD3_ANALISIS.md](docs/ACTIVIDAD3_ANALISIS.md) |
| API en Render | https://mi-proyecto-expo.onrender.com |
| Repositorio | https://github.com/SeguraStward/mi-proyecto-expo |
| Video de demostración | _(pendiente — se agrega al entregar)_ |
