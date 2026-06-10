/**
 * ============================================================================
 * chat.types — Tipos del backend de chat grupal
 * ============================================================================
 *
 * Espejan el esquema OpenAPI de https://github.com/JoseDanielJ/chat_backend
 * (FastAPI). Solo se modela lo necesario para la sala grupal v1.
 * ============================================================================
 */

/** Usuario de chat tal como lo devuelve el backend. */
export interface ChatUser {
  id: string;
  nickname: string;
  joined_at: string;
  is_online: boolean;
  public_key?: string | null;
}

/** Adjunto de media (no usado en v1, modelado por completitud). */
export interface MediaAttachment {
  url: string;
  public_id: string;
  resource_type: 'image' | 'video' | 'raw';
  format: string;
  size_bytes: number;
  original_filename: string;
  width?: number;
  height?: number;
  duration?: number;
}

/** Mensaje de chat (grupal o DM). En v1 solo usamos `type: 'group'`. */
export interface ChatMessage {
  id: string;
  sender_id: string;
  sender_nickname: string;
  content: string;
  type: 'group' | 'dm';
  recipient_id?: string | null;
  timestamp: string;
  ttl?: number | null;
  expires_at?: string | null;
  allow_read_receipt?: boolean;
  media?: MediaAttachment | null;
}

/** Respuesta de POST /api/chat/join. */
export interface JoinResponse {
  user: ChatUser;
  token: string;
}

// ── Eventos del WebSocket (WS /ws/{token}) ──────────────────────────────────

/** Mensajes que el cliente envia al servidor por WebSocket. */
export type ChatClientEvent =
  | { type: 'group_message'; content: string }
  | { type: 'dm'; to: string; content: string }
  | { type: 'ping' };

/** Mensajes que el servidor emite por WebSocket. */
export type ChatServerEvent =
  | { type: 'group_message'; message: ChatMessage }
  | { type: 'dm'; message: ChatMessage }
  | { type: 'group_history'; messages: ChatMessage[] }
  | { type: 'users_list'; users: ChatUser[] }
  | { type: 'user_joined'; user: ChatUser }
  | { type: 'user_left'; user_id: string }
  | { type: 'pong' }
  | { type: string; [key: string]: unknown };
