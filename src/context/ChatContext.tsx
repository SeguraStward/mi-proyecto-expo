/**
 * ============================================================================
 * ChatContext — Estado global de la sala de chat grupal
 * ============================================================================
 *
 * - Hace auto-join al montar usando el displayName del usuario Firebase.
 * - Mantiene un WebSocket (wss://host/ws/{token}) para tiempo real:
 *   recibe `group_history` al conectar y `group_message` en broadcast.
 * - Reintenta la conexion con backoff y manda `ping` de keep-alive.
 * - Respaldo REST: si el socket no esta abierto, envia por POST y refresca.
 *
 * Se provee dentro del area autenticada (app/(app)/_layout.tsx), por lo que
 * se monta/desmonta junto con la sesion.
 * ============================================================================
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { useAuth } from '@/src/context/AuthContext';
import {
  buildChatWsUrl,
  getDmMessages,
  getGroupMessages,
  getOnlineUsers,
  joinChat,
  sendDmRest,
  sendGroupMessageRest,
} from '@/src/services/chatApi';
import type {
  ChatMessage,
  ChatServerEvent,
  ChatUser,
} from '@/src/types-dtos/chat.types';

export type ChatStatus = 'connecting' | 'connected' | 'reconnecting' | 'error';

interface ChatContextValue {
  status: ChatStatus;
  /** Mensajes de la sala grupal, orden cronologico (mas antiguo primero). */
  messages: ChatMessage[];
  chatUser: ChatUser | null;
  error: string | null;
  /** Usuarios online (para abrir conversaciones privadas). */
  users: ChatUser[];
  /** DMs por id del otro usuario, orden cronologico. */
  dmMessages: Record<string, ChatMessage[]>;
  /** Envia un mensaje a la sala grupal. */
  sendMessage: (content: string) => Promise<void>;
  /** Envia un DM a otro usuario. */
  sendDm: (toId: string, content: string) => Promise<void>;
  /** Carga el historial de DMs con un usuario. */
  loadDm: (otherId: string) => Promise<void>;
  /** Refresca la lista de usuarios online. */
  refreshUsers: () => Promise<void>;
  /** Reintenta el join + conexion tras un error. */
  retry: () => void;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

const PING_INTERVAL_MS = 30_000;
const RECONNECT_BASE_MS = 1_500;
const RECONNECT_MAX_MS = 15_000;

/** Resuelve el nickname a partir del usuario de Firebase. */
function resolveNickname(displayName?: string | null, email?: string | null): string {
  const fromName = displayName?.trim();
  if (fromName) return fromName.slice(0, 30);
  const fromEmail = email?.split('@')[0]?.trim();
  if (fromEmail) return fromEmail.slice(0, 30);
  return 'Cultivador';
}

/** Inserta un mensaje evitando duplicados por id, manteniendo orden cronologico. */
function mergeMessage(list: ChatMessage[], msg: ChatMessage): ChatMessage[] {
  if (list.some((m) => m.id === msg.id)) return list;
  return [...list, msg];
}

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [status, setStatus] = useState<ChatStatus>('connecting');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatUser, setChatUser] = useState<ChatUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [dmMessages, setDmMessages] = useState<Record<string, ChatMessage[]>>({});

  // Refs que sobreviven a renders sin re-disparar efectos.
  const tokenRef = useRef<string | null>(null);
  const myIdRef = useRef<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const pingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const attemptsRef = useRef(0);
  const mountedRef = useRef(true);
  const reconnectFnRef = useRef<() => void>(() => {});

  const clearTimers = useCallback(() => {
    if (pingRef.current) {
      clearInterval(pingRef.current);
      pingRef.current = null;
    }
    if (reconnectRef.current) {
      clearTimeout(reconnectRef.current);
      reconnectRef.current = null;
    }
  }, []);

  const handleServerEvent = useCallback((event: ChatServerEvent) => {
    switch (event.type) {
      case 'group_history':
        if (Array.isArray((event as { messages?: ChatMessage[] }).messages)) {
          setMessages((event as { messages: ChatMessage[] }).messages);
        }
        break;
      case 'group_message': {
        const msg = (event as { message?: ChatMessage }).message;
        if (msg && msg.type === 'group') {
          setMessages((prev) => mergeMessage(prev, msg));
        }
        break;
      }
      case 'dm': {
        const msg = (event as { message?: ChatMessage }).message;
        if (msg) {
          // La conversacion se indexa por el OTRO participante.
          const myId = myIdRef.current;
          const partner = msg.sender_id === myId ? msg.recipient_id : msg.sender_id;
          if (partner) {
            setDmMessages((prev) => ({
              ...prev,
              [partner]: mergeMessage(prev[partner] ?? [], msg),
            }));
          }
        }
        break;
      }
      case 'users_list': {
        const list = (event as { users?: ChatUser[] }).users;
        if (Array.isArray(list)) setUsers(list);
        break;
      }
      case 'user_joined': {
        const u = (event as { user?: ChatUser }).user;
        if (u) setUsers((prev) => [...prev.filter((p) => p.id !== u.id), u]);
        break;
      }
      case 'user_left': {
        const id = (event as { user_id?: string }).user_id;
        if (id) setUsers((prev) => prev.filter((p) => p.id !== id));
        break;
      }
      default:
        // pong u otros: ignorar.
        break;
    }
  }, []);

  /** Abre el WebSocket con el token actual. */
  const openSocket = useCallback(
    (token: string) => {
      let socket: WebSocket;
      try {
        socket = new WebSocket(buildChatWsUrl(token));
      } catch {
        reconnectFnRef.current();
        return;
      }
      wsRef.current = socket;

      socket.onopen = () => {
        if (!mountedRef.current) return;
        attemptsRef.current = 0;
        setStatus('connected');
        setError(null);
        clearTimers();
        pingRef.current = setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: 'ping' }));
          }
        }, PING_INTERVAL_MS);
      };

      socket.onmessage = (e) => {
        if (!mountedRef.current) return;
        try {
          const data = JSON.parse(e.data as string) as ChatServerEvent;
          handleServerEvent(data);
        } catch {
          // mensaje no-JSON: ignorar
        }
      };

      socket.onerror = () => {
        // onclose se encargara de la reconexion.
      };

      socket.onclose = () => {
        if (!mountedRef.current) return;
        if (pingRef.current) {
          clearInterval(pingRef.current);
          pingRef.current = null;
        }
        reconnectFnRef.current();
      };
    },
    [clearTimers, handleServerEvent],
  );

  /** Programa una reconexion del socket con backoff exponencial. */
  const scheduleReconnect = useCallback(() => {
    if (!mountedRef.current || !tokenRef.current) return;
    setStatus('reconnecting');
    const delay = Math.min(
      RECONNECT_BASE_MS * 2 ** attemptsRef.current,
      RECONNECT_MAX_MS,
    );
    attemptsRef.current += 1;
    reconnectRef.current = setTimeout(() => {
      if (mountedRef.current && tokenRef.current) {
        openSocket(tokenRef.current);
      }
    }, delay);
  }, [openSocket]);

  useEffect(() => {
    reconnectFnRef.current = scheduleReconnect;
  }, [scheduleReconnect]);

  /** Hace join al backend y abre el socket. */
  const connect = useCallback(async () => {
    setStatus('connecting');
    setError(null);
    try {
      const nickname = resolveNickname(user?.displayName, user?.email);
      const { user: joinedUser, token } = await joinChat(nickname);
      if (!mountedRef.current) return;
      tokenRef.current = token;
      myIdRef.current = joinedUser.id;
      setChatUser(joinedUser);
      // Carga inicial por REST (el WS tambien manda group_history/users_list).
      try {
        const history = await getGroupMessages(token);
        if (mountedRef.current && history.length) setMessages(history);
      } catch {
        // si falla, el group_history del WS cubrira la carga inicial
      }
      try {
        const onlineUsers = await getOnlineUsers(token);
        if (mountedRef.current) setUsers(onlineUsers);
      } catch {
        // el users_list del WS cubrira la lista
      }
      openSocket(token);
    } catch (e) {
      if (!mountedRef.current) return;
      setError(e instanceof Error ? e.message : 'No se pudo conectar al chat');
      setStatus('error');
    }
  }, [user?.displayName, user?.email, openSocket]);

  // Auto-join al montar / cuando hay usuario autenticado.
  useEffect(() => {
    mountedRef.current = true;
    connect();
    return () => {
      mountedRef.current = false;
      clearTimers();
      wsRef.current?.close();
      wsRef.current = null;
    };
    // Solo re-conectar si cambia la identidad del usuario.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  const sendMessage = useCallback(async (content: string) => {
    const text = content.trim();
    if (!text) return;
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'group_message', content: text }));
      return;
    }
    // Respaldo REST si el socket no esta disponible.
    const token = tokenRef.current;
    if (!token) throw new Error('Sin sesion de chat activa');
    const msg = await sendGroupMessageRest(token, text);
    setMessages((prev) => mergeMessage(prev, msg));
  }, []);

  const sendDm = useCallback(async (toId: string, content: string) => {
    const text = content.trim();
    if (!text) return;
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'dm', to: toId, content: text }));
      return;
    }
    // Respaldo REST si el socket no esta disponible.
    const token = tokenRef.current;
    if (!token) throw new Error('Sin sesion de chat activa');
    const msg = await sendDmRest(token, toId, text);
    setDmMessages((prev) => ({
      ...prev,
      [toId]: mergeMessage(prev[toId] ?? [], msg),
    }));
  }, []);

  const loadDm = useCallback(async (otherId: string) => {
    const token = tokenRef.current;
    if (!token) return;
    try {
      const history = await getDmMessages(token, otherId);
      if (mountedRef.current) {
        setDmMessages((prev) => ({ ...prev, [otherId]: history }));
      }
    } catch {
      // si falla, los DMs en vivo del WS iran llegando
    }
  }, []);

  const refreshUsers = useCallback(async () => {
    const token = tokenRef.current;
    if (!token) return;
    try {
      const onlineUsers = await getOnlineUsers(token);
      if (mountedRef.current) setUsers(onlineUsers);
    } catch {
      // ignorar: el WS mantiene la lista
    }
  }, []);

  const retry = useCallback(() => {
    attemptsRef.current = 0;
    clearTimers();
    wsRef.current?.close();
    wsRef.current = null;
    connect();
  }, [clearTimers, connect]);

  return (
    <ChatContext.Provider
      value={{
        status,
        messages,
        chatUser,
        error,
        users,
        dmMessages,
        sendMessage,
        sendDm,
        loadDm,
        refreshUsers,
        retry,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export function useChat(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within a ChatProvider');
  return ctx;
}
