import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';

import type { PlantIdentificationResult } from '@/src/types-dtos/identification.types';

const API_URL =
  process.env.EXPO_PUBLIC_PLANT_API_URL ?? 'http://localhost:3000';

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

const PlantIdentificationService = {
  async identify(photoUri: string): Promise<PlantIdentificationResult> {
    const imageBase64 = await uriToBase64(photoUri);

    const response = await fetch(`${API_URL}/api/identify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64 }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`Error del servidor (${response.status}): ${text}`);
    }

    const data = (await response.json()) as Omit<
      PlantIdentificationResult,
      'photoUri'
    >;

    return { ...data, photoUri };
  },
};

export default PlantIdentificationService;
