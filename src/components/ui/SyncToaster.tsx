/**
 * SyncToaster — Componente invisible que dispara un toast cada vez que
 * la cola de sincronizacion termina de procesar pendientes.
 *
 * Se monta UNA sola vez en el layout raiz para evitar duplicados.
 */

import { useEffect } from 'react';

import { useToast } from '@/src/context/ToastContext';
import syncService from '@/src/services/syncService';

export const SyncToaster: React.FC = () => {
  const { showToast } = useToast();

  useEffect(() => {
    const unsubscribe = syncService.subscribeComplete(({ processed, failed }) => {
      if (processed > 0 && failed === 0) {
        showToast({
          type: 'success',
          message: `Tus cambios se han sincronizado (${processed})`,
        });
      } else if (processed > 0 && failed > 0) {
        showToast({
          type: 'info',
          message: `${processed} sincronizado${processed === 1 ? '' : 's'}, ${failed} con error`,
          duration: 5000,
        });
      } else if (failed > 0) {
        showToast({
          type: 'error',
          message: `Sincronizacion fallida (${failed} pendiente${failed === 1 ? '' : 's'})`,
          duration: 5000,
        });
      }
    });
    return unsubscribe;
  }, [showToast]);

  return null;
};

export default SyncToaster;
