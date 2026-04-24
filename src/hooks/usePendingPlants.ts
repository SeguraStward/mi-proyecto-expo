import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

import localDb from '@/src/services/localDb';
import syncService from '@/src/services/syncService';
import type { CreatePlantPayload } from '@/src/services/syncService';

export interface PendingPlant {
  tempId: string;
  nickname: string;
  commonName: string;
  scientificName: string;
  photoUri: string | null;
  hasError: boolean;
}

function rowToPending(row: {
  id: number;
  payload: string;
  status: string;
}): PendingPlant | null {
  try {
    const payload = JSON.parse(row.payload) as CreatePlantPayload;
    return {
      tempId: `pending-${row.id}`,
      nickname: payload.plantData.nickname,
      commonName: payload.plantData.botanicalInfo.commonName,
      scientificName: payload.plantData.botanicalInfo.scientificName,
      photoUri: payload.photoUri,
      hasError: row.status === 'error',
    };
  } catch {
    return null;
  }
}

export function usePendingPlants(): PendingPlant[] {
  const [pending, setPending] = useState<PendingPlant[]>([]);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    let active = true;

    const refresh = async () => {
      try {
        const rows = await localDb.getPending();
        const list = rows
          .filter((r) => r.operation === 'create_plant')
          .map(rowToPending)
          .filter((p): p is PendingPlant => p !== null);
        if (active) setPending(list);
      } catch {
        // DB no inicializada todavia
      }
    };

    refresh();
    const unsubscribe = syncService.subscribe(refresh);
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return pending;
}
