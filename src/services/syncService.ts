import type { PlantDocument } from '@/src/types-dtos/plant.types';

import { createPlant, uploadPlantPhoto, upsertPlant } from './firestore';
import localDb, { SyncQueueRow } from './localDb';

export interface CreatePlantPayload {
  plantData: Omit<PlantDocument, 'id'>;
  photoUri: string | null;
}

const listeners = new Set<() => void>();
let isSyncing = false;

function notify() {
  listeners.forEach((l) => l());
}

export function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function getIsSyncing(): boolean {
  return isSyncing;
}

async function runCreatePlant(payload: CreatePlantPayload): Promise<void> {
  const plantId = await createPlant(payload.plantData);
  if (payload.photoUri) {
    const url = await uploadPlantPhoto(plantId, payload.photoUri);
    const now = new Date().toISOString();
    await upsertPlant(plantId, {
      photos: [{ url, isPrimary: true, caption: '', takenAt: now }],
    });
  }
}

async function processItem(row: SyncQueueRow): Promise<void> {
  await localDb.markInProgress(row.id);
  try {
    const payload = JSON.parse(row.payload);
    switch (row.operation) {
      case 'create_plant':
        await runCreatePlant(payload as CreatePlantPayload);
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

  return { processed, failed };
}

export async function countPending(): Promise<number> {
  return localDb.countPending();
}

export const syncService = {
  queueCreatePlant,
  drainQueue,
  countPending,
  subscribe,
  getIsSyncing,
};

export default syncService;
