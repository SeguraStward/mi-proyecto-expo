/**
 * Constantes de API.
 */

/**
 * Backend de chat grupal (FastAPI, desplegado en Render).
 * Repo: https://github.com/JoseDanielJ/chat_backend
 * Auth: el token devuelto por /api/chat/join se envia en el header `X-User-Token`.
 * Tiempo real: WebSocket en `${CHAT_WS_URL}/ws/{token}`.
 */
export const CHAT_API_URL =
  process.env.EXPO_PUBLIC_CHAT_API_URL ?? 'https://chat-backend-4nzg.onrender.com';

/** URL base del WebSocket derivada de CHAT_API_URL (http→ws, https→wss). */
export const CHAT_WS_URL = CHAT_API_URL.replace(/^http/, 'ws');

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
