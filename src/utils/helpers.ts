/**
 * Funciones auxiliares de utilidad.
 */

/** Formatea una fecha ISO a una cadena legible en español */
export function formatDate(iso: string, options?: Intl.DateTimeFormatOptions): string {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    ...options,
  });
}

/** Abrevia un número grande: 1200 → "1.2K" */
export function abbreviateNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}
