export interface ParsedBase64Image {
  payload: string;
  mimeType?: string;
}

export function inferMimeTypeFromBase64(payload: string): string | undefined {
  if (payload.startsWith('/9j/')) return 'image/jpeg';
  if (payload.startsWith('iVBORw0KGgo')) return 'image/png';
  if (payload.startsWith('UklGR')) return 'image/webp';
  if (payload.startsWith('R0lGOD')) return 'image/gif';
  return undefined;
}

export function extractAndValidateBase64(imageBase64: string): ParsedBase64Image {
  const clean = imageBase64.replace(/\s/g, '').trim();

  let payload = clean;
  let mimeType: string | undefined;

  if (clean.startsWith('data:')) {
    const match = clean.match(/^data:([^;,]+);base64,(.+)$/i);
    if (!match) {
      throw new Error('Imagen invalida: data URI mal formado');
    }
    mimeType = match[1];
    payload = match[2];
  }

  if (!payload || payload.length < 128) {
    throw new Error('Imagen invalida: base64 vacio o incompleto');
  }

  if (!/^[A-Za-z0-9+/=]+$/.test(payload)) {
    throw new Error('Imagen invalida: base64 con caracteres no permitidos');
  }

  return { payload, mimeType };
}
