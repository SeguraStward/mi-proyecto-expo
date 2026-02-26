import type { UserInterface } from '@/src/types-dtos/user.types';
import { useCallback, useState } from 'react';

// Datos de ejemplo (reemplaza con tu fuente real / API)
const MOCK_USER: UserInterface = {
  nombre: 'María García',
  apodo: '@plantlover',
  cantidadPlantas: 47,
  categorias: ['Suculentas', 'Tropicales', 'Cactus', 'Aromáticas', 'Helechos'],
  racha: 23,
  cumple: '1998-06-15',
  imagen: 'https://i.pravatar.cc/300?img=47',
  amigos: 128,
  privacidad: false,
  descripcion: 'Amante de las plantas 🌿 Convirtiendo mi hogar en una selva urbana, una maceta a la vez.',
  plantaFavorita: 'Monstera Deliciosa',
};

export function useUserProfile() {
  const [user, setUser] = useState<UserInterface>(MOCK_USER);
  const [isLoading, setIsLoading] = useState(false);

  const togglePrivacy = useCallback(() => {
    setUser((prev) => ({ ...prev, privacidad: !prev.privacidad }));
    // TODO: llamar servicio para persistir el cambio
  }, []);

  const refreshProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      // TODO: obtener datos reales del API
      // const data = await userService.getProfile();
      // setUser(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { user, isLoading, togglePrivacy, refreshProfile };
}
