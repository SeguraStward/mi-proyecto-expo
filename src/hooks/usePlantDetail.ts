import { getPlantById } from '@/src/services/firestore';
import type { PlantDocument } from '@/src/types-dtos/plant.types';
import { useCallback, useEffect, useState } from 'react';

export function usePlantDetail(plantId: string | undefined) {
  const [plant, setPlant] = useState<PlantDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlant = useCallback(async () => {
    if (!plantId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await getPlantById(plantId);
      setPlant(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar planta');
    } finally {
      setIsLoading(false);
    }
  }, [plantId]);

  useEffect(() => {
    fetchPlant();
  }, [fetchPlant]);

  return { plant, isLoading, error, refetch: fetchPlant };
}
