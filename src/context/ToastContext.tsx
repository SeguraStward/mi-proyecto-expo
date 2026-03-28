import { Toast, type ToastType } from '@/src/components/ui/Toast';
import React, { createContext, useCallback, useContext, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

interface ToastConfig {
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  showToast: (config: ToastConfig) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastConfig | null>(null);
  const [visible, setVisible] = useState(false);

  const showToast = useCallback((config: ToastConfig) => {
    setToast(config);
    setVisible(true);
  }, []);

  const handleDismiss = useCallback(() => {
    setVisible(false);
    setToast(null);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      <View style={styles.root}>
        {children}
        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            visible={visible}
            onDismiss={handleDismiss}
            duration={toast.duration}
          />
        )}
      </View>
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    // En web, position fixed para que el toast flote sobre todo el contenido
    ...(Platform.OS === 'web' ? ({ position: 'relative' } as any) : {}),
  },
});

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
