import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useNetworkStatus } from '@/src/hooks/useNetworkStatus';
import { useSyncQueue } from '@/src/hooks/useSyncQueue';
import type { AppTheme } from '@/src/theme';
import { useAppTheme } from '@/src/theme/designSystem';

type BannerMode = 'hidden' | 'offline' | 'syncing' | 'synced';

export const OfflineBanner: React.FC = () => {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const s = getStyles(theme, insets.top);
  const { isConnected, isInternetReachable } = useNetworkStatus();
  const { pendingCount, isSyncing } = useSyncQueue();

  const [mode, setMode] = useState<BannerMode>('hidden');
  const translateY = useSharedValue(-80);

  const online = isConnected && isInternetReachable;

  useEffect(() => {
    let next: BannerMode = 'hidden';
    if (!online) {
      next = 'offline';
    } else if (isSyncing || pendingCount > 0) {
      next = 'syncing';
    }
    setMode(next);
  }, [online, isSyncing, pendingCount]);

  useEffect(() => {
    if (mode === 'hidden') {
      translateY.value = withTiming(-80, { duration: 200 });
    } else {
      translateY.value = withTiming(0, { duration: 250 });
    }
  }, [mode, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (mode === 'hidden') return null;

  const content = getBannerContent(mode, pendingCount);

  return (
    <Animated.View
      style={[s.banner, { backgroundColor: content.bg }, animatedStyle]}
      pointerEvents="none"
    >
      <MaterialCommunityIcons name={content.icon} size={16} color={content.fg} />
      <Text style={[s.text, { color: content.fg }]}>{content.label}</Text>
    </Animated.View>
  );
};

function getBannerContent(mode: BannerMode, pending: number) {
  switch (mode) {
    case 'offline':
      return {
        icon: 'wifi-off' as const,
        label: 'SIN CONEXION — LOS CAMBIOS SE SINCRONIZARAN',
        bg: '#AE2012',
        fg: '#FFFFFF',
      };
    case 'syncing':
      return {
        icon: 'sync' as const,
        label: `SINCRONIZANDO ${pending} PENDIENTE${pending === 1 ? '' : 'S'}...`,
        bg: '#DDA15E',
        fg: '#2B1D0E',
      };
    case 'synced':
      return {
        icon: 'check-circle' as const,
        label: 'TODO SINCRONIZADO',
        bg: '#386641',
        fg: '#FFFFFF',
      };
    default:
      return { icon: 'information' as const, label: '', bg: '#000', fg: '#FFF' };
  }
}

function getStyles(t: AppTheme, topInset: number) {
  return StyleSheet.create({
    banner: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      paddingTop: topInset + 4,
      paddingBottom: 8,
      paddingHorizontal: t.spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      zIndex: 9999,
      elevation: 9999,
    },
    text: {
      fontFamily: t.typography.fontFamily,
      fontSize: 10,
      letterSpacing: 1,
    },
  });
}

export default OfflineBanner;
