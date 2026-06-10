/**
 * ============================================================================
 * chatApi — Cliente del backend de chat grupal
 * ============================================================================
 *
 * Backend FastAPI (https://github.com/JoseDanielJ/chat_backend).
 * El token de sesion se obtiene en /api/chat/join y se envia en el header
 * `X-User-Token` para el resto de endpoints. El tiempo real va por WebSocket
 * (ver buildChatWsUrl + ChatContext); estas funciones REST son para el join
 * y como respaldo de carga/envio si el socket no esta disponible.
 * ============================================================================
 */

import { CHAT_API_URL, CHAT_WS_URL } from '@/src/constants/api';
import type { ChatMessage, ChatUser, JoinResponse } from '@/src/types-dtos/chat.types';

const TOKEN_HEADER = 'X-User-Token';

async function request<T>(
  endpoint: string,
  options: RequestInit & { token?: string } = {},
): Promise<T> {
  const { token, headers, ...rest } = options;

  const res = await fetch(`${CHAT_API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { [TOKEN_HEADER]: token } : {}),
      ...headers,
    },
    ...rest,
  });

  if (!res.ok) {
    let detail = '';
    try {
      const body = await res.json();
      detail = typeof body?.detail === 'string' ? ` — ${body.detail}` : '';
    } catch {
      // respuesta sin cuerpo JSON
    }
    throw new Error(`Chat API ${res.status}${detail}`);
  }

  return res.json() as Promise<T>;
}

/** Registra/une al usuario a la sala con un nickname. Devuelve user + token. */
export function joinChat(nickname: string): Promise<JoinResponse> {
  return request<JoinResponse>('/api/chat/join', {
    method: 'POST',
    body: JSON.stringify({ nickname }),
  });
}

/** Historial de la sala grupal (respaldo; el WS tambien envia group_history). */
export function getGroupMessages(token: string, limit = 50): Promise<ChatMessage[]> {
  return request<ChatMessage[]>(`/api/chat/messages?limit=${limit}`, {
    method: 'GET',
    token,
  });
}

/** Envia un mensaje a la sala grupal por REST (respaldo si no hay WS). */
export function sendGroupMessageRest(token: string, content: string): Promise<ChatMessage> {
  return request<ChatMessage>('/api/chat/messages', {
    method: 'POST',
    token,
    body: JSON.stringify({ type: 'group', content }),
  });
}

/** Lista de usuarios online (para abrir conversaciones privadas). */
export function getOnlineUsers(token: string): Promise<ChatUser[]> {
  return request<ChatUser[]>('/api/chat/users', { method: 'GET', token });
}

/** Historial de DMs con un usuario (respaldo; el WS tambien entrega dm en vivo). */
export function getDmMessages(token: string, otherId: string): Promise<ChatMessage[]> {
  return request<ChatMessage[]>(`/api/chat/messages/dm/${encodeURIComponent(otherId)}`, {
    method: 'GET',
    token,
  });
}

/** Envia un DM por REST (respaldo si no hay WS). */
export function sendDmRest(
  token: string,
  recipientId: string,
  content: string,
): Promise<ChatMessage> {
  return request<ChatMessage>('/api/chat/messages', {
    method: 'POST',
    token,
    body: JSON.stringify({ type: 'dm', recipient_id: recipientId, content }),
  });
}

/** Cierra la sesion de chat en el servidor. */
export function logoutChat(token: string): Promise<unknown> {
  return request<unknown>('/api/chat/logout', { method: 'POST', token });
}

/** Construye la URL del WebSocket autenticado: wss://host/ws/{token}. */
export function buildChatWsUrl(token: string): string {
  return `${CHAT_WS_URL}/ws/${encodeURIComponent(token)}`;
}
