import { useSyncExternalStore } from 'react';

import type { PlantIdentificationResult } from '@/src/types-dtos/identification.types';

let currentResult: PlantIdentificationResult | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export const identificationStore = {
  setResult(result: PlantIdentificationResult | null) {
    currentResult = result;
    emit();
  },
  getResult(): PlantIdentificationResult | null {
    return currentResult;
  },
  clear() {
    currentResult = null;
    emit();
  },
  subscribe(cb: () => void) {
    listeners.add(cb);
    return () => {
      listeners.delete(cb);
    };
  },
};

export function useIdentificationResult(): PlantIdentificationResult | null {
  return useSyncExternalStore(
    identificationStore.subscribe,
    identificationStore.getResult,
    () => null
  );
}
