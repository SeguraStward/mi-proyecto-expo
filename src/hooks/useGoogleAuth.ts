import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

// Necesario para cerrar el popup del navegador al volver a la app
WebBrowser.maybeCompleteAuthSession();

export function useGoogleAuth() {
  const [, response, promptAsync] = Google.useIdTokenAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ?? '',
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '',
  });

  return { response, promptAsync };
}
