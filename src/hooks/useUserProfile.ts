import { useAuth } from '@/src/context/AuthContext';
import { getUserById } from '@/src/services/firestore';
import type { UserDocument } from '@/src/types-dtos/user.types';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

export function useUserProfile() {
  const { user } = useAuth();
  const [userDoc, setUserDoc] = useState<UserDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user?.uid) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await getUserById(user.uid);
      setUserDoc(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar perfil');
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid]);

  // Refetch cada vez que la pantalla gana foco
  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [fetchProfile])
  );

  return { userDoc, isLoading, error, refetch: fetchProfile };
}
