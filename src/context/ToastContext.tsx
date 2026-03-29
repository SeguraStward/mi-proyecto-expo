import { Toast, type ToastType } from '@/src/components/ui/Toast';
import React, { createContext, useCallback, useContext, useRef, useState } from 'react';

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
  const keyRef = useRef(0);

  const showToast = useCallback((config: ToastConfig) => {
    keyRef.current += 1;
    setToast(config);
    setVisible(true);
  }, []);

  const handleDismiss = useCallback(() => {
    setVisible(false);
    setToast(null);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Toast
          key={keyRef.current}
          type={toast.type}
          message={toast.message}
          visible={visible}
          onDismiss={handleDismiss}
          duration={toast.duration}
        />
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
