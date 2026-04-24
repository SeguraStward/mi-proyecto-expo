import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

export interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean;
  type: string;
}

function toStatus(state: NetInfoState): NetworkStatus {
  return {
    isConnected: state.isConnected ?? false,
    isInternetReachable: state.isInternetReachable ?? false,
    type: state.type,
  };
}

export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>({
    isConnected: true,
    isInternetReachable: true,
    type: 'unknown',
  });

  useEffect(() => {
    NetInfo.fetch().then((state) => setStatus(toStatus(state)));
    const unsubscribe = NetInfo.addEventListener((state) => {
      setStatus(toStatus(state));
    });
    return unsubscribe;
  }, []);

  return status;
}
