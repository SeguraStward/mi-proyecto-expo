import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

import syncService from '@/src/services/syncService';

import { useNetworkStatus } from './useNetworkStatus';

interface UseSyncQueueReturn {
  pendingCount: number;
  isSyncing: boolean;
}

export function useSyncQueue(): UseSyncQueueReturn {
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const { isConnected, isInternetReachable } = useNetworkStatus();
  const online = isConnected && isInternetReachable;

  useEffect(() => {
    if (Platform.OS === 'web') return;

    let active = true;

    const refresh = async () => {
      try {
        const count = await syncService.countPending();
        if (active) setPendingCount(count);
        if (active) setIsSyncing(syncService.getIsSyncing());
      } catch {
        // DB aun no lista; ignorar
      }
    };

    refresh();
    const unsubscribe = syncService.subscribe(refresh);
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web') return;
    if (!online) return;
    if (pendingCount === 0) return;
    syncService.drainQueue().catch(() => {});
  }, [online, pendingCount]);

  return { pendingCount, isSyncing };
}
