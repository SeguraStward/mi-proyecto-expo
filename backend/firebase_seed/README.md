# Backend Python para Seed de Firestore

Este modulo permite cargar datos JSON a Firestore usando Firebase Admin SDK.

## 1) Ejecutar con Docker (recomendado)

Desde la raiz del proyecto:

```bash
./dev.sh seed-dry-run
./dev.sh seed-write
```

Tambien puedes correr comandos directos:

```bash
docker compose build seed
docker compose run --rm seed python seed_firestore.py --dry-run
docker compose run --rm seed python seed_firestore.py
```

## 2) Preparar entorno Python local (opcional)

Desde esta carpeta:

```bash
cd backend/firebase_seed
python -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip setuptools wheel
python -m pip install -r requirements.txt
```

## 3) Obtener service account

En Firebase Console:

1. Project settings
2. Service accounts
3. Generate new private key

Guardar la llave en una ruta segura dentro del backend (por ejemplo `../data/marketplacebotanico-firebase-adminsdk-*.json`).

Luego crea un archivo `.env` dentro de esta carpeta con:

```bash
FIREBASE_CREDENTIALS_PATH=../data/marketplacebotanico-firebase-adminsdk-fbsvc-2051c371d5.json
FIREBASE_SEED_DATA_PATH=../data/datos_iniciales.json
FIREBASE_PROJECT_ID=marketplacebotanico
```

## 4) Archivo de datos

El seed por defecto usa:

- `../data/datos_iniciales.json`

Formato requerido:

```json
{
  "collections": {
    "users": [{ "id": "user-1" }],
    "plants": [{ "id": "plant-1" }]
  }
}
```

## 5) Ejecutar seed

```bash
python seed_firestore.py
```

Comando con archivo de datos custom:

```bash
python seed_firestore.py \
  --credentials ../data/marketplacebotanico-firebase-adminsdk-fbsvc-d0fe9a0db2.json \
  --data ../data/firebase_seed_data.json
```

Modo validacion sin escribir:

```bash
python seed_firestore.py \
  --credentials ./serviceAccountKey.json \
  --dry-run
```

## 6) Permisos recomendados

La cuenta de servicio debe poder operar sobre Firestore. Roles tipicos:

- Firebase Admin
- Cloud Datastore User

Si hay errores de permisos, revisar IAM del proyecto y reglas de Firestore.
