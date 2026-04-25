import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';

import type { PlantIdentificationResult } from '@/src/types-dtos/identification.types';

const API_URL =
  process.env.EXPO_PUBLIC_PLANT_API_URL ?? 'http://localhost:3000';

interface IdentifyOptions {
  imageBase64?: string;
}

async function uriToBase64(uri: string): Promise<string> {
  if (uri.startsWith('data:')) {
    return uri.split(',')[1] ?? '';
  }
  if (Platform.OS === 'web') {
    const response = await fetch(uri);
    const blob = await response.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1] ?? '');
      };
      reader.onerror = () => reject(new Error('No se pudo leer la imagen'));
      reader.readAsDataURL(blob);
    });
  }
  return await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
}

function normalizeBase64(input: string): string {
  return input.replace(/\s/g, '').trim();
}

async function parseBackendError(response: Response): Promise<string> {
  const raw = await response.text().catch(() => '');
  if (!raw) return `Error del servidor (${response.status})`;

  try {
    const parsed = JSON.parse(raw) as { error?: string };
    if (typeof parsed.error === 'string' && parsed.error.trim()) {
      return `Error del servidor (${response.status}): ${parsed.error}`;
    }
  } catch {
    // Respuesta no JSON: usar texto plano tal cual.
  }

  return `Error del servidor (${response.status}): ${raw}`;
}

const PlantIdentificationService = {
  async identify(
    photoUri: string,
    options: IdentifyOptions = {}
  ): Promise<PlantIdentificationResult> {
    const providedBase64 = options.imageBase64 ? normalizeBase64(options.imageBase64) : '';
    const imageBase64 = providedBase64 || normalizeBase64(await uriToBase64(photoUri));

    if (!imageBase64 || imageBase64.length < 128) {
      throw new Error('No se pudo leer la imagen correctamente. Toma otra foto e intenta de nuevo.');
    }

    const response = await fetch(`${API_URL}/api/identify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64 }),
    });

    if (!response.ok) {
      throw new Error(await parseBackendError(response));
    }

    const data = (await response.json()) as Omit<
      PlantIdentificationResult,
      'photoUri'
    >;

    return { ...data, photoUri };
  },
};

export default PlantIdentificationService;
