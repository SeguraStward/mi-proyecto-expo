# Firebase Database Design - Plant Marketplace

Fecha: 2026-03-18
Proyecto: Mi Proyecto Expo
Motor recomendado: Firebase Authentication + Cloud Firestore + Firebase Storage

## 1) Objetivo del modelo

Este modelo soporta:

- Registro de dos tipos de cuenta: comprador y empresa vivero.
- Publicacion de plantas para venta (marketplace).
- Mantenimiento y ficha botanica de plantas para que otros usuarios puedan evaluar compra.
- Perfil publico estilo "feed" tipo Instagram (publicaciones con fotos y metadata).
- Red social entre usuarios con nombre tematico de jardineria.

Nombre propuesto para la relacion entre usuarios:

- `companerosDeHuerto` (equivale a "amigos" en la app).

## 2) Arquitectura Firebase recomendada

- `Authentication`: login por email/password (y opcional Google).
- `Firestore`: datos transaccionales y feed social.
- `Storage`: fotos de perfil y fotos de plantas (maximo 5 por planta).
- `Cloud Functions` (fase 2): validaciones de negocio, notificaciones y mantenimiento de contadores.

## 3) Colecciones principales (Firestore)

### 3.1 `users`

Un documento por usuario autenticado.

Clave del doc: `uid` de Firebase Auth.

Campos sugeridos:

- `id`: string (redundante opcional, igual a uid)
- `accountType`: enum `buyer | company`
- `displayName`: string
- `username`: string unico (para perfil publico)
- `email`: string
- `phoneNumber`: string (E.164 recomendado)
- `bio`: string
- `profilePhotoUrl`: string (Storage URL)
- `socialLinks`: map
- `socialLinks.instagram`: string opcional
- `socialLinks.facebook`: string opcional
- `socialLinks.tiktok`: string opcional
- `socialLinks.website`: string opcional
- `location`: map
- `location.country`: string
- `location.city`: string
- `isVerifiedSeller`: boolean
- `ratingAverage`: number (0-5)
- `ratingCount`: number
- `plantsPublishedCount`: number
- `plantsInStockCount`: number
- `createdAt`: timestamp
- `updatedAt`: timestamp
- `lastActiveAt`: timestamp
- `isPublicProfile`: boolean

### 3.2 `plants`

Plantas publicadas para venta o visibilidad en feed.

Clave del doc: `plantId` (string).

Campos sugeridos (incluye perspectiva botanica):

- `id`: string
- `ownerId`: string (uid del vendedor)
- `ownerType`: enum `buyer | company`
- `status`: enum `draft | active | reserved | sold | hidden`
- `nameCommon`: string (ej: Lavanda)
- `nameScientific`: string (ej: Lavandula angustifolia)
- `family`: string (ej: Lamiaceae)
- `variety`: string opcional
- `description`: string
- `ageValue`: number (edad)
- `ageUnit`: enum `months | years`
- `sizeCm`: number (altura aprox)
- `potDiameterCm`: number
- `stockQuantity`: number (si es empresa, puede ser > 1)
- `priceAmount`: number
- `priceCurrency`: string (ej: PEN, USD)
- `isNegotiable`: boolean
- `photos`: array max 5 elementos
- `photos[].url`: string
- `photos[].storagePath`: string
- `photos[].isPrimary`: boolean
- `care`: map
- `care.lightLevel`: enum `full_sun | partial_shade | bright_indirect | low_light`
- `care.wateringFrequencyDays`: number
- `care.humidityMin`: number (0-100)
- `care.humidityMax`: number (0-100)
- `care.temperatureMinC`: number
- `care.temperatureMaxC`: number
- `care.substrateType`: string (ej: drenante, organico)
- `care.fertilizationFrequencyDays`: number
- `care.pruningSeason`: string opcional
- `care.toxicityPets`: enum `none | mild | toxic`
- `care.toxicityHumans`: enum `none | mild | toxic`
- `care.difficulty`: enum `easy | medium | hard`
- `care.notes`: string
- `maintenance`: map
- `maintenance.lastWateredAt`: timestamp
- `maintenance.nextWateringAt`: timestamp
- `maintenance.lastFertilizedAt`: timestamp opcional
- `maintenance.healthScore`: number (0-100)
- `tags`: array string (ej: interior, aromatica, medicinal)
- `location`: map
- `location.country`: string
- `location.city`: string
- `visibility`: enum `public | companions_only | private`
- `metrics`: map
- `metrics.views`: number
- `metrics.saves`: number
- `metrics.likes`: number
- `metrics.comments`: number
- `createdAt`: timestamp
- `updatedAt`: timestamp

### 3.3 `posts`

Publicaciones para el feed tipo Instagram.

Campos sugeridos:

- `id`: string
- `authorId`: string
- `authorType`: enum `buyer | company`
- `plantId`: string opcional (si el post referencia una planta)
- `caption`: string
- `media`: array (imagen/video, para inicio puedes usar solo imagen)
- `media[].type`: enum `image`
- `media[].url`: string
- `media[].storagePath`: string
- `visibility`: enum `public | companions_only`
- `isMarketplaceHighlight`: boolean
- `createdAt`: timestamp
- `updatedAt`: timestamp

### 3.4 `companerosDeHuerto`

Relacion social entre usuarios (amistad jardinera).

Campos sugeridos:

- `id`: string
- `userAId`: string
- `userBId`: string
- `status`: enum `pending | accepted | blocked`
- `requestedBy`: string
- `createdAt`: timestamp
- `updatedAt`: timestamp

Regla util: guardar siempre `pairKey` ordenado alfabeticamente (`minUid_maxUid`) para evitar duplicados.

### 3.5 `plantMaintenanceLogs`

Historial de mantenimiento por planta.

Campos sugeridos:

- `id`: string
- `plantId`: string
- `ownerId`: string
- `actionType`: enum `water | fertilize | repot | prune | pest_control | note`
- `note`: string opcional
- `photoUrl`: string opcional
- `performedAt`: timestamp
- `createdAt`: timestamp

### 3.6 `orders` (fase marketplace)

Pedido o intento de compra.

Campos sugeridos:

- `id`: string
- `buyerId`: string
- `sellerId`: string
- `plantId`: string
- `quantity`: number
- `unitPrice`: number
- `totalPrice`: number
- `currency`: string
- `status`: enum `pending | accepted | rejected | paid | shipped | delivered | canceled`
- `contactSnapshot`: map (telefono/red social capturada al momento de compra)
- `createdAt`: timestamp
- `updatedAt`: timestamp

### 3.7 `reviews` (fase marketplace)

Resenas entre compradores y vendedores.

Campos:

- `id`: string
- `orderId`: string
- `reviewerId`: string
- `reviewedUserId`: string
- `rating`: number (1-5)
- `comment`: string
- `createdAt`: timestamp

## 4) Subcolecciones opcionales (alternativa)

Si quieres reducir lecturas por pantalla:

- `users/{uid}/savedPlants`
- `users/{uid}/notifications`
- `users/{uid}/followers` y `users/{uid}/following` (si migras a modelo de seguidores en vez de amistad)
- `plants/{plantId}/comments`

## 5) Reglas de negocio importantes

- Una planta no puede tener mas de 5 fotos.
- Solo `ownerId` puede editar su planta.
- `stockQuantity` no puede ser negativo.
- `status = sold` obliga `stockQuantity = 0` en venta unitaria.
- `companerosDeHuerto` no puede duplicar la misma pareja.
- Empresas pueden publicar multiples unidades por planta.
- Compradores tambien pueden publicar, pero solo si perfil es publico o validado segun regla de producto.

## 6) Indices recomendados (Firestore)

1. `plants` por `status ASC`, `createdAt DESC`
2. `plants` por `ownerId ASC`, `createdAt DESC`
3. `plants` por `visibility ASC`, `metrics.likes DESC`
4. `posts` por `visibility ASC`, `createdAt DESC`
5. `companerosDeHuerto` por `userAId ASC`, `status ASC`
6. `companerosDeHuerto` por `userBId ASC`, `status ASC`
7. `orders` por `buyerId ASC`, `createdAt DESC`
8. `orders` por `sellerId ASC`, `createdAt DESC`

## 7) Seguridad (resumen de reglas)

- Lectura publica de `plants` y `posts` solo cuando `visibility = public`.
- Lectura para `companions_only` solo si existe relacion aceptada en `companerosDeHuerto`.
- Escritura en `plants`, `posts`, `plantMaintenanceLogs` solo del propietario.
- Campos sensibles (`email`, `phoneNumber`) pueden exponerse con vista controlada.

## 8) Mapeo de datos actuales -> nuevo modelo

Datos actuales observados:

- `users`: `id`, `email`, `createdAt`
- `plants`: `id`, `userId`, `name`

Mapeo inicial:

- `plants.userId` -> `plants.ownerId`
- `plants.name` -> `plants.nameCommon`
- agregar defaults para cuidado botanico (`care.*`) y mantenimiento (`maintenance.*`)

## 9) JSON de seed

Se incluyo un archivo completo para poblar Firestore con formato por colecciones:

- `backend/data/firebase_seed_data.json`

Formato:

```json
{
  "collections": {
    "users": [],
    "plants": [],
    "posts": [],
    "companerosDeHuerto": [],
    "plantMaintenanceLogs": [],
    "orders": [],
    "reviews": []
  }
}
```

## 10) Plan de implementacion sugerido

1. Crear proyecto Firebase y habilitar Auth, Firestore y Storage.
2. Definir reglas iniciales de Firestore y Storage.
3. Sembrar datos de prueba con script Python (`backend/firebase_seed/seed_firestore.py`).
4. Migrar servicios de la app para leer/escribir en Firestore.
5. Reemplazar mocks locales por consultas paginadas.
6. Activar indices recomendados segun queries reales.
