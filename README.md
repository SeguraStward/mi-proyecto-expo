# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
# 📱 Mi Proyecto Expo con Docker

Este proyecto utiliza **Docker** para mantener el sistema anfitrión limpio y asegurar que todos los desarrolladores usen la misma versión de Node.js y dependencias. 
**Nota:** Al usar Docker, todos los comandos de desarrollo y paquetes deben ejecutarse *dentro* del contenedor para evitar problemas de permisos (`EACCES`).

---

## 🚀 Guía de Uso Rápido

### 1. Iniciar la Aplicación

Para levantar el entorno y el servidor de desarrollo (Metro bundler):

```bash
# Paso 1: Levanta el contenedor en segundo plano (si no está corriendo)
docker compose up -d

# Paso 2: Inicia Expo (Genera el código QR)
docker compose exec app npx expo start
```

**Opciones de ejecución importantes:**
* **Conexión local fallida (Expo Go):** Si el código QR se queda cargando y no conecta en tu celular por restricciones de la red Docker, utiliza el modo túnel:
  ```bash
  docker compose exec app npx expo start --tunnel
  ```
* **Probar en la Web:** Para abrir directamente la visualización web en tu navegador:
  ```bash
  docker compose exec app npx expo start -w
  ```

### 2. Instalar y Actualizar Paquetes

No uses `npm install` localmente desde tu terminal raíz. **Siempre hazlo dentro del contenedor** para mantener sincronizadas las dependencias del `package.json` y el `node_modules` del contenedor.

```bash
# Instalar un nuevo paquete (Ejemplo: axios)
docker compose exec app npm install axios

# Actualizar todas las dependencias
docker compose exec app npm install

# Agregar un paquete nativo que requiere configuración de Expo (Ejemplo: expo-font)
docker compose exec app npx expo install expo-font
```

### 3. Solución de Problemas de Permisos (EACCES)

Si experimentas errores como `EACCES: permission denied` al intentar guardar archivos como `expo-env.d.ts`, significa que esos archivos se crearon con permisos del contenedor (root). 
Para solucionarlo, nunca inicies `npx expo start` fuera del contenedor, asegúrate siempre de usar el prefijo `docker compose exec app` como se indicó arriba.

---

## Migracion a Firebase (Marketplace de Plantas)

Se agrego una propuesta completa para migrar datos y logica a Firebase antes de construir mas pantallas.

### Documentacion del modelo de base de datos

- `docs/FIREBASE_DATABASE_MARKETPLACE.md`

Incluye:

- colecciones principales de Firestore
- campos recomendados para comprador y empresa
- ficha botanica de plantas con campos de cuidado
- feed social tipo Instagram
- relacion social con nombre tematico `companerosDeHuerto`
- indices y reglas de negocio

### Datos semilla JSON

- `backend/data/firebase_seed_data.json`

### Backend Python para subir datos a Firestore

- `backend/firebase_seed/README.md`
- `backend/firebase_seed/seed_firestore.py`

Resumen rapido:

```bash
cd backend/firebase_seed
python -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python seed_firestore.py --credentials ./serviceAccountKey.json
```

## Salvatantas tresmil
npx expo start --tunnel --clear
