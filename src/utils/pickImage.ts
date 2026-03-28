import * as ImagePicker from 'expo-image-picker';
import { Alert, Platform } from 'react-native';

/**
 * Abre el selector de imagenes. En web usa un input HTML nativo
 * para evitar el bug de expo-image-picker con MIME types.
 * En nativo usa expo-image-picker normalmente.
 */
export async function pickImage(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return pickImageWeb();
  }
  return pickImageNative();
}

async function pickImageNative(): Promise<string | null> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galeria.');
    return null;
  }
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.7,
  });
  if (!result.canceled && result.assets[0]) {
    return result.assets[0].uri;
  }
  return null;
}

function pickImageWeb(): Promise<string | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) {
        resolve(null);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    };
    input.oncancel = () => resolve(null);
    input.click();
  });
}
