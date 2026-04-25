# Retro Garden — Plant Identification API

API proxy para identificación de plantas. La app móvil envía una imagen en base64 y este servicio la procesa con **Gemini** o **Plant.id** (según configuración), devolviendo una respuesta normalizada.

## Estructura

```
backend/api/
├── src/
│   ├── index.ts                # Servidor Express + CORS
│   ├── routes/identify.ts      # POST /api/identify
│   ├── services/plantIdClient.ts  # Integración con Plant.id
│   ├── services/geminiClient.ts   # Integración con Gemini Vision
│   └── types.ts                # Tipos compartidos
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## Variables de entorno

Copiar `.env.example` a `.env` y completar:

| Variable | Descripción |
|----------|-------------|
| `PORT` | Puerto del servidor (default `3000`) |
| `AI_PROVIDER` | Proveedor preferido: `gemini` o `plantid` (default `plantid`) |
| `PLANT_ID_API_KEY` | API key de [plant.id](https://plant.id) — opcional si usas Gemini |
| `PLANT_ID_BASE_URL` | Base URL de Plant.id (default `https://plant.id/api/v3`) |
| `GEMINI_API_KEY` | API key de Google AI Studio (Gemini) — opcional si usas Plant.id |
| `GEMINI_MODEL` | Modelo Gemini (default `gemini-1.5-flash`) |
| `ALLOWED_ORIGINS` | Orígenes CORS permitidos, separados por coma, o `*` |

Si configuras ambos proveedores, el endpoint hace **fallback automático** al otro proveedor cuando el preferido falla.

## Desarrollo local

```bash
cd backend/api
npm install
cp .env.example .env
# editar .env con AI_PROVIDER y tu API key correspondiente
npm run dev
```

El servidor arranca en `http://localhost:3000`.

## Endpoints

### `GET /`
Health check simple.

### `GET /health`
Health check con timestamp.

### `POST /api/identify`
Identifica una planta a partir de una imagen.

**Request:**
```json
{ "imageBase64": "iVBORw0KGgoAAAA..." }
```

**Response (planta detectada):**
```json
{
  "isPlant": true,
  "commonName": "Monstera",
  "scientificName": "Monstera deliciosa",
  "confidence": 0.94,
  "family": "Araceae",
  "toxicity": "Toxic to pets",
  "care": {
    "water": "Moderada",
    "light": "Luz indirecta brillante",
    "soil": "Drenante y rico en materia orgánica"
  }
}
```

**Response (no es planta):**
```json
{
  "isPlant": false,
  "commonName": "",
  "scientificName": "",
  "confidence": 0.12
}
```

## Deploy en Render

1. Ir a [render.com](https://render.com) → New Web Service
2. Conectar el repositorio de GitHub
3. Configurar:
   - **Root Directory:** `backend/api`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Environment:** Node
4. En "Environment Variables" agregar:
  - `AI_PROVIDER` = `gemini` (recomendado) o `plantid`
  - `GEMINI_API_KEY` = tu key de Google AI Studio
  - (opcional) `PLANT_ID_API_KEY` = tu key de Plant.id para fallback
   - `ALLOWED_ORIGINS` = `*` (o los orígenes específicos de la app)
5. Deploy

La URL del servicio queda como `https://<service-name>.onrender.com`. Copiarla en el `.env` del proyecto Expo:

```
EXPO_PUBLIC_PLANT_API_URL=https://retro-garden-plant-api.onrender.com
```

## Notas

- **Plan gratuito de Plant.id:** 100 identificaciones/mes.
- **Gemini:** obtén API key en Google AI Studio (https://aistudio.google.com/app/apikey).
- **Plan gratuito de Render:** el servicio se duerme tras 15 min de inactividad y tarda ~30s en despertar. Aceptable para demo/laboratorio.
- La API key **nunca** se envía a la app móvil: solo vive en el backend como variable de entorno.
