import type { PlantDocument } from '@/src/types-dtos/plant.types';

import {
  createPlant,
  updateUser,
  uploadPlantPhoto,
  uploadUserAvatar,
  upsertPlant,
} from './firestore';
import localDb, { SyncQueueRow } from './localDb';

export interface CreatePlantPayload {
  plantData: Omit<PlantDocument, 'id'>;
  photoUri: string | null;
}

export interface UploadPlantPhotoPayload {
  plantId: string;
  photoUri: string;
  /** Datos del form para mostrar info al usuario en la lista de pendientes */
  nickname?: string;
  commonName?: string;
  scientificName?: string;
}

export interface UpdateUserAvatarPayload {
  uid: string;
  avatarUri: string;
  bio: string;
}

export type SyncCompleteEvent = {
  processed: number;
  failed: number;
};

const listeners = new Set<() => void>();
const completeListeners = new Set<(e: SyncCompleteEvent) => void>();
let isSyncing = false;

function notify() {
  listeners.forEach((l) => l());
}

function notifyComplete(e: SyncCompleteEvent) {
  completeListeners.forEach((l) => l(e));
}

export function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function subscribeComplete(cb: (e: SyncCompleteEvent) => void): () => void {
  completeListeners.add(cb);
  return () => {
    completeListeners.delete(cb);
  };
}

export function getIsSyncing(): boolean {
  return isSyncing;
}

async function runCreatePlant(payload: CreatePlantPayload): Promise<void> {
  const plantId = await createPlant(payload.plantData);
  if (payload.photoUri) {
    try {
      const url = await uploadPlantPhoto(plantId, payload.photoUri);
      const now = new Date().toISOString();
      await upsertPlant(plantId, {
        photos: [{ url, isPrimary: true, caption: '', takenAt: now }],
      });
    } catch (err) {
      // La planta YA se creo en Firestore. Si lanzamos error, esta fila quedaria
      // como 'error' y el siguiente drain volveria a llamar createPlant() →
      // duplicado. En su lugar, encolamos SOLO la foto y marcamos esta operacion
      // como completada (la planta existe — no hay nada mas que hacer aqui).
      await localDb.enqueue('upload_plant_photo', {
        plantId,
        photoUri: payload.photoUri,
        nickname: payload.plantData.nickname,
        commonName: payload.plantData.botanicalInfo.commonName,
        scientificName: payload.plantData.botanicalInfo.scientificName,
      } satisfies UploadPlantPhotoPayload);
      console.warn('[syncService] foto pendiente para reintento:', err);
    }
  }
}

async function runUploadPlantPhoto(payload: UploadPlantPhotoPayload): Promise<void> {
  const url = await uploadPlantPhoto(payload.plantId, payload.photoUri);
  const now = new Date().toISOString();
  await upsertPlant(payload.plantId, {
    photos: [{ url, isPrimary: true, caption: '', takenAt: now }],
  });
}

async function runUpdateUserAvatar(payload: UpdateUserAvatarPayload): Promise<void> {
  const url = await uploadUserAvatar(payload.uid, payload.avatarUri);
  await updateUser(payload.uid, {
    profile: {
      bio: payload.bio,
      avatarUrl: url,
    },
  });
}

async function processItem(row: SyncQueueRow): Promise<void> {
  await localDb.markInProgress(row.id);
  try {
    const payload = JSON.parse(row.payload);
    switch (row.operation) {
      case 'create_plant':
        await runCreatePlant(payload as CreatePlantPayload);
        break;
      case 'upload_plant_photo':
        await runUploadPlantPhoto(payload as UploadPlantPhotoPayload);
        break;
      case 'update_user_avatar':
        await runUpdateUserAvatar(payload as UpdateUserAvatarPayload);
        break;
      default:
        throw new Error(`Operacion no soportada: ${row.operation}`);
    }
    await localDb.markCompleted(row.id);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido';
    await localDb.markError(row.id, message);
    throw err;
  }
}

export async function queueCreatePlant(payload: CreatePlantPayload): Promise<number> {
  const id = await localDb.enqueue('create_plant', payload);
  notify();
  return id;
}

export async function queueUploadPlantPhoto(payload: UploadPlantPhotoPayload): Promise<number> {
  const id = await localDb.enqueue('upload_plant_photo', payload);
  notify();
  return id;
}

export async function queueUpdateUserAvatar(payload: UpdateUserAvatarPayload): Promise<number> {
  const id = await localDb.enqueue('update_user_avatar', payload);
  notify();
  return id;
}

export async function drainQueue(): Promise<{ processed: number; failed: number }> {
  if (isSyncing) return { processed: 0, failed: 0 };
  isSyncing = true;
  notify();

  let processed = 0;
  let failed = 0;

  try {
    const pending = await localDb.getPending();
    for (const row of pending) {
      try {
        await processItem(row);
        processed += 1;
      } catch {
        failed += 1;
      }
      notify();
    }
  } finally {
    isSyncing = false;
    notify();
  }

  const result = { processed, failed };
  if (processed > 0 || failed > 0) {
    notifyComplete(result);
  }
  return result;
}

export async function countPending(): Promise<number> {
  return localDb.countPending();
}

export const syncService = {
  queueCreatePlant,
  queueUploadPlantPhoto,
  queueUpdateUserAvatar,
  drainQueue,
  countPending,
  subscribe,
  subscribeComplete,
  getIsSyncing,
};

export default syncService;
