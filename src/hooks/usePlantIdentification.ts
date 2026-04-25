import { useCallback, useState } from 'react';

import PlantIdentificationService from '@/src/services/plantIdentificationService';
import type { PlantIdentificationResult } from '@/src/types-dtos/identification.types';

interface UsePlantIdentificationReturn {
  result: PlantIdentificationResult | null;
  isLoading: boolean;
  error: string | null;
  identify: (
    photoUri: string,
    options?: { imageBase64?: string }
  ) => Promise<PlantIdentificationResult | null>;
  reset: () => void;
}

export function usePlantIdentification(): UsePlantIdentificationReturn {
  const [result, setResult] = useState<PlantIdentificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const identify = useCallback(
    async (
      photoUri: string,
      options?: { imageBase64?: string }
    ): Promise<PlantIdentificationResult | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const identification = await PlantIdentificationService.identify(photoUri, options);
        setResult(identification);
        return identification;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al identificar la planta';
        setError(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { result, isLoading, error, identify, reset };
}
