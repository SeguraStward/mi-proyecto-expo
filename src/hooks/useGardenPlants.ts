import { useAuth } from '@/src/context/AuthContext';
import { getPlantsByUser } from '@/src/services/firestore';
import type { PlantDocument } from '@/src/types-dtos/plant.types';
import { useCallback, useEffect, useState } from 'react';

export function useGardenPlants() {
  const { user } = useAuth();
  const [plants, setPlants] = useState<PlantDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlants = useCallback(async () => {
    if (!user?.uid) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await getPlantsByUser(user.uid);
      setPlants(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar plantas');
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchPlants();
  }, [fetchPlants]);

  return { plants, isLoading, error, refetch: fetchPlants };
}
