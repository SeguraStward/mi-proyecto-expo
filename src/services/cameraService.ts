import { CameraView, CameraType, FlashMode } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { RefObject } from 'react';

export interface PhotoResult {
  uri: string;
  width: number;
  height: number;
  base64?: string;
}

export interface VideoResult {
  uri: string;
}

export interface CaptureOptions {
  quality?: number; // 0 a 1
  base64?: boolean;
  skipProcessing?: boolean;
}

export interface VideoOptions {
  maxDuration?: number; // segundos
  quality?: '2160p' | '1080p' | '720p' | '480p' | '4:3';
}

const CameraService = {
  async takePhoto(
    cameraRef: RefObject<CameraView>,
    options: CaptureOptions = {}
  ): Promise<PhotoResult> {
    if (!cameraRef.current) {
      throw new Error('La cámara no está disponible');
    }

    const photo = await cameraRef.current.takePictureAsync({
      quality: options.quality ?? 0.8,
      base64: options.base64 ?? false,
      skipProcessing: options.skipProcessing ?? false,
    });

    if (!photo) throw new Error('No se pudo capturar la foto');

    return {
      uri: photo.uri,
      width: photo.width,
      height: photo.height,
      base64: photo.base64,
    };
  },

  async startRecording(
    cameraRef: RefObject<CameraView>,
    options: VideoOptions = {}
  ): Promise<VideoResult> {
    if (!cameraRef.current) {
      throw new Error('La cámara no está disponible');
    }

    const video = await cameraRef.current.recordAsync({
      maxDuration: options.maxDuration ?? 60,
    });

    if (!video) throw new Error('No se pudo iniciar la grabación');

    return { uri: video.uri };
  },

  stopRecording(cameraRef: RefObject<CameraView>): void {
    if (!cameraRef.current) return;
    cameraRef.current.stopRecording();
  },

  async saveToGallery(uri: string): Promise<MediaLibrary.Asset> {
    const asset = await MediaLibrary.createAssetAsync(uri);
    return asset;
  },

  toggleFacing(current: CameraType): CameraType {
    return current === 'back' ? 'front' : 'back';
  },

  cycleFlashMode(current: FlashMode): FlashMode {
    const modes: FlashMode[] = ['off', 'on', 'auto'];
    const index = modes.indexOf(current);
    return modes[(index + 1) % modes.length];
  },
};

export default CameraService;
