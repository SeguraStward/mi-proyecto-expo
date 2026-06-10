/**
 * ============================================================================
 * Chat — Sala grupal + mensajes directos (DMs)
 * ============================================================================
 *
 * Dos vistas dentro del mismo tab:
 *   - "General": sala grupal (broadcast a todos).
 *   - "Personas": lista de usuarios online → conversacion privada 1 a 1.
 *
 * Todo en tiempo real por WebSocket (ChatContext). Estetica pixel art.
 * ============================================================================
 */

import { useChat } from '@/src/context/ChatContext';
import type { AppTheme } from '@/src/theme';
import { useAppTheme } from '@/src/theme/designSystem';
import type { ChatMessage, ChatUser } from '@/src/types-dtos/chat.types';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/src/components/ui/AppText';
import { Chip } from '@/src/components/ui/Chip';
import { RetroButton } from '@/src/components/ui/RetroButton';
import { getStyles } from './Chat.styles';

// Altura del BottomNavBar flotante + holgura. Ver src/components/common/BottomNavBar.tsx
const NAV_BAR_HEIGHT = 58;
const NAV_BAR_GAP = 14;

/** Formatea un timestamp ISO a HH:MM. */
function formatTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

type ChatTab = 'group' | 'people';

export default function Chat() {
  const theme = useAppTheme();
  const s = getStyles(theme);
  const insets = useSafeAreaInsets();
  const {
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
  } = useChat();

  const [tab, setTab] = useState<ChatTab>('group');
  const [activeDm, setActiveDm] = useState<ChatUser | null>(null);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showEvt = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvt = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const sub1 = Keyboard.addListener(showEvt, (e) =>
      setKeyboardHeight(e.endCoordinates?.height ?? 0),
    );
    const sub2 = Keyboard.addListener(hideEvt, () => setKeyboardHeight(0));
    return () => {
      sub1.remove();
      sub2.remove();
    };
  }, []);

  const keyboardShown = keyboardHeight > 0;
  const bottomOffset = Math.max(insets.bottom, Platform.OS === 'android' ? 12 : 8);
  // Con teclado: el KeyboardAvoidingView ya levanta el contenido y la barra
  // flotante se oculta → solo una holgura minima. Sin teclado: holgura para
  // no quedar bajo la barra flotante.
  const composerClearance = keyboardShown
    ? theme.spacing.sm
    : bottomOffset + NAV_BAR_HEIGHT + NAV_BAR_GAP;

  const inDm = !!activeDm;
  const threadMessages = inDm ? dmMessages[activeDm.id] ?? [] : messages;
  const reversed = useMemo(() => [...threadMessages].reverse(), [threadMessages]);

  const otherUsers = useMemo(
    () => users.filter((u) => u.id !== chatUser?.id),
    [users, chatUser?.id],
  );

  const openDm = useCallback(
    (u: ChatUser) => {
      setActiveDm(u);
      loadDm(u.id);
    },
    [loadDm],
  );

  const handleSend = useCallback(async () => {
    const text = draft.trim();
    if (!text || sending) return;
    setSending(true);
    try {
      if (inDm && activeDm) {
        await sendDm(activeDm.id, text);
      } else {
        await sendMessage(text);
      }
      setDraft('');
    } catch {
      // El estado de conexion refleja el problema; el texto se conserva.
    } finally {
      setSending(false);
    }
  }, [draft, sending, inDm, activeDm, sendDm, sendMessage]);

  const renderMessage = useCallback(
    ({ item }: { item: ChatMessage }) => {
      const isMine = !!chatUser && item.sender_id === chatUser.id;
      const textColor = isMine ? theme.colors.textOnPrimary : theme.colors.textPrimary;
      const metaColor = isMine ? theme.colors.textOnPrimary : theme.colors.textMuted;
      return (
        <View style={[s.row, isMine ? s.rowMine : s.rowTheirs]}>
          <View style={[s.bubble, isMine ? s.bubbleMine : s.bubbleTheirs]}>
            {!isMine && !inDm && (
              <AppText preset="caption" color={theme.colors.secondary}>
                {item.sender_nickname}
              </AppText>
            )}
            <AppText preset="body" color={textColor}>
              {item.content}
            </AppText>
            <View style={s.bubbleMeta}>
              <AppText preset="overline" color={metaColor}>
                {formatTime(item.timestamp)}
              </AppText>
            </View>
          </View>
        </View>
      );
    },
    [chatUser, inDm, s, theme.colors],
  );

  const renderUser = useCallback(
    ({ item }: { item: ChatUser }) => (
      <Pressable
        style={s.userRow}
        onPress={() => openDm(item)}
        accessibilityRole="button"
        accessibilityLabel={`Chatear con ${item.nickname}`}
      >
        <View style={s.userAvatar}>
          <AppText preset="subtitle" color={theme.colors.textOnPrimary}>
            {item.nickname.slice(0, 1).toUpperCase()}
          </AppText>
        </View>
        <View style={s.userInfo}>
          <AppText preset="bodySmall" color={theme.colors.textPrimary}>
            {item.nickname}
          </AppText>
          <AppText preset="caption" color={theme.colors.textMuted}>
            {item.is_online ? 'En linea' : 'Desconectado'}
          </AppText>
        </View>
        <MaterialCommunityIcons
          name="chevron-right"
          size={22}
          color={theme.colors.textMuted}
        />
      </Pressable>
    ),
    [s, theme.colors, openDm],
  );

  // ── Estados de pantalla completa ─────────────────────────────
  if (status === 'error') {
    return (
      <View style={[s.container, s.centered]}>
        <MaterialCommunityIcons name="wifi-off" size={48} color={theme.colors.error} />
        <AppText preset="subtitle" color={theme.colors.textPrimary}>
          Sin conexion al chat
        </AppText>
        <AppText preset="bodySmall" color={theme.colors.textMuted} style={{ textAlign: 'center' }}>
          {error ?? 'No se pudo conectar a la sala.'}
        </AppText>
        <RetroButton label="Reintentar" onPress={retry} style={s.retryBtn} />
      </View>
    );
  }

  if (status === 'connecting' && messages.length === 0 && users.length === 0) {
    return (
      <View style={[s.container, s.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <AppText preset="bodySmall" color={theme.colors.textMuted}>
          Entrando al chat...
        </AppText>
      </View>
    );
  }

  const canSend = draft.trim().length > 0 && !sending;
  const showComposer = inDm || tab === 'group';

  return (
    <KeyboardAvoidingView
      style={s.container}
      behavior="padding"
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View style={s.header}>
        {inDm ? (
          <Pressable
            onPress={() => setActiveDm(null)}
            style={s.backBtn}
            accessibilityRole="button"
            accessibilityLabel="Volver a la lista"
            hitSlop={8}
          >
            <MaterialCommunityIcons name="chevron-left" size={26} color={theme.colors.primary} />
          </Pressable>
        ) : null}
        <View style={s.headerTexts}>
          <AppText preset="subtitle" color={theme.colors.textPrimary}>
            {inDm ? activeDm.nickname : 'CHAT'}
          </AppText>
          <AppText preset="caption" color={theme.colors.textMuted}>
            {inDm ? 'Mensaje directo' : statusLabel(status)}
          </AppText>
        </View>
        <View style={[s.statusDot, { backgroundColor: statusColor(status, theme) }]} />
      </View>

      {/* Selector General / Personas (oculto dentro de un DM) */}
      {!inDm && (
        <View style={s.segment}>
          <Chip label="General" active={tab === 'group'} onPress={() => setTab('group')} />
          <Chip
            label={`Personas${otherUsers.length ? ` (${otherUsers.length})` : ''}`}
            active={tab === 'people'}
            onPress={() => {
              setTab('people');
              refreshUsers();
            }}
          />
        </View>
      )}

      {/* Cuerpo: lista de personas o hilo de mensajes */}
      {!inDm && tab === 'people' ? (
        <FlatList
          data={otherUsers}
          keyExtractor={(item) => item.id}
          renderItem={renderUser}
          contentContainerStyle={s.listContent}
          ListEmptyComponent={
            <View style={s.centered}>
              <MaterialCommunityIcons
                name="account-group-outline"
                size={40}
                color={theme.colors.textMuted}
              />
              <AppText preset="bodySmall" color={theme.colors.textMuted}>
                No hay otras personas conectadas
              </AppText>
            </View>
          }
        />
      ) : (
        <FlatList
          data={reversed}
          inverted
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={s.listContent}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View style={s.centered}>
              <MaterialCommunityIcons
                name="message-text-outline"
                size={40}
                color={theme.colors.textMuted}
              />
              <AppText preset="bodySmall" color={theme.colors.textMuted}>
                {inDm ? 'Escribe el primer mensaje' : 'Aun no hay mensajes. Saluda!'}
              </AppText>
            </View>
          }
        />
      )}

      {/* Composer */}
      {showComposer && (
        <View style={[s.composer, { paddingBottom: composerClearance }]}>
          <TextInput
            style={s.input}
            value={draft}
            onChangeText={setDraft}
            placeholder="Escribe un mensaje..."
            placeholderTextColor={theme.colors.textMuted}
            multiline
            accessibilityLabel="Mensaje"
          />
          <Pressable
            onPress={handleSend}
            disabled={!canSend}
            style={[s.sendBtn, !canSend && s.sendBtnDisabled]}
            accessibilityRole="button"
            accessibilityLabel="Enviar mensaje"
            accessibilityState={{ disabled: !canSend }}
          >
            {sending ? (
              <ActivityIndicator size="small" color={theme.colors.textOnPrimary} />
            ) : (
              <MaterialCommunityIcons
                name="send"
                size={22}
                color={canSend ? theme.colors.textOnPrimary : theme.colors.textMuted}
              />
            )}
          </Pressable>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

function statusLabel(status: ReturnType<typeof useChat>['status']): string {
  switch (status) {
    case 'connected':
      return 'En linea';
    case 'connecting':
      return 'Conectando...';
    case 'reconnecting':
      return 'Reconectando...';
    case 'error':
      return 'Desconectado';
    default:
      return '';
  }
}

function statusColor(
  status: ReturnType<typeof useChat>['status'],
  theme: AppTheme,
): string {
  switch (status) {
    case 'connected':
      return theme.colors.primary;
    case 'error':
      return theme.colors.error;
    default:
      return theme.colors.secondary;
  }
}
