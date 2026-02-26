/**
 * Constantes de API.
 */
export const ApiConstants = {
  BASE_URL: 'https://api.example.com/v1', // TODO: reemplazar con tu URL real
  TIMEOUT: 10_000,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      REFRESH: '/auth/refresh',
    },
    USER: {
      PROFILE: '/users/me',
      UPDATE: '/users/me',
    },
    PLANTS: {
      LIST: '/plants',
      DETAIL: (id: string) => `/plants/${id}`,
    },
  },
} as const;
