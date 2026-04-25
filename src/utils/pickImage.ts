import * as ImagePicker from 'expo-image-picker';
import { Alert, Platform } from 'react-native';

export type PickImageSource = 'camera' | 'library';

/**
 * Abre un menu para que el usuario elija camara o galeria.
 * Ambas opciones son 100% offline — no requieren red ni IA.
 * Pasa `source` para forzar una opcion sin mostrar el menu.
 */
export async function pickImage(source?: PickImageSource): Promise<string | null> {
  if (Platform.OS === 'web') {
    return pickImageWeb();
  }
  if (source === 'camera') return pickFromCamera();
  if (source === 'library') return pickFromLibrary();
  return askSource();
}

function askSource(): Promise<string | null> {
  return new Promise((resolve) => {
    Alert.alert(
      'Agregar foto',
      'Como queres elegir la foto?',
      [
        {
          text: 'Camara',
          onPress: async () => resolve(await pickFromCamera()),
        },
        {
          text: 'Galeria',
          onPress: async () => resolve(await pickFromLibrary()),
        },
        { text: 'Cancelar', style: 'cancel', onPress: () => resolve(null) },
      ],
      { cancelable: true, onDismiss: () => resolve(null) },
    );
  });
}

async function pickFromCamera(): Promise<string | null> {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permiso requerido', 'Necesitamos acceso a la camara.');
    return null;
  }
  const result = await ImagePicker.launchCameraAsync({
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

async function pickFromLibrary(): Promise<string | null> {
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
  // Acceso seguro a APIs de browser — solo se ejecuta en web
  const win = globalThis as any;
  if (typeof win.document === 'undefined') return Promise.resolve(null);

  return new Promise((resolve) => {
    const input = win.document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) { resolve(null); return; }
      const reader = new win.FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    };
    input.oncancel = () => resolve(null);
    input.click();
  });
}
