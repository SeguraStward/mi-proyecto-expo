import { useRef, useState, useCallback, useEffect } from 'react';
import { CameraView, CameraType, FlashMode } from 'expo-camera';

import CameraService, {
  PhotoResult,
  VideoResult,
  CaptureOptions,
  VideoOptions,
} from '@/src/services/cameraService';
import PermissionService, { AppPermissions } from '@/src/services/permissionService';

interface UseCameraOptions {
  requestOnMount?: boolean;
}

interface UseCameraReturn {
  cameraRef: React.RefObject<CameraView | null>;
  permissions: AppPermissions | null;
  isPermissionGranted: boolean;
  isLoadingPermissions: boolean;
  facing: CameraType;
  flashMode: FlashMode;
  isRecording: boolean;
  requestPermissions: () => Promise<void>;
  takePhoto: (options?: CaptureOptions) => Promise<PhotoResult | null>;
  startRecording: (options?: VideoOptions) => Promise<VideoResult | null>;
  stopRecording: () => void;
  toggleFacing: () => void;
  toggleFlash: () => void;
  saveToGallery: (uri: string) => Promise<void>;
  lastPhoto: PhotoResult | null;
  error: string | null;
}

export function useCamera(options: UseCameraOptions = {}): UseCameraReturn {
  const { requestOnMount = true } = options;

  const cameraRef = useRef<CameraView>(null);

  const [permissions, setPermissions] = useState<AppPermissions | null>(null);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
  const [facing, setFacing] = useState<CameraType>('back');
  const [flashMode, setFlashMode] = useState<FlashMode>('off');
  const [isRecording, setIsRecording] = useState(false);
  const [lastPhoto, setLastPhoto] = useState<PhotoResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isPermissionGranted =
    !!permissions &&
    PermissionService.isGranted(permissions.camera) &&
    PermissionService.isGranted(permissions.mediaLibrary);

  const requestPermissions = useCallback(async () => {
    setIsLoadingPermissions(true);
    setError(null);
    try {
      const result = await PermissionService.requestAllPermissions();
      setPermissions(result);
    } catch {
      setError('Error al solicitar permisos');
    } finally {
      setIsLoadingPermissions(false);
    }
  }, []);

  useEffect(() => {
    if (requestOnMount) {
      requestPermissions();
    }
  }, [requestOnMount]);

  const takePhoto = useCallback(async (opts: CaptureOptions = {}): Promise<PhotoResult | null> => {
    setError(null);
    if (cameraRef.current === null) {
      throw new Error('No se ha detectado ninguna cámara');
    }
    try {
      const photo = await CameraService.takePhoto(
        cameraRef as React.RefObject<CameraView>,
        opts
      );
      setLastPhoto(photo);
      return photo;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al capturar foto';
      setError(message);
      return null;
    }
  }, []);

  const startRecording = useCallback(async (opts: VideoOptions = {}): Promise<VideoResult | null> => {
    setError(null);
    if (cameraRef.current === null) {
      throw new Error('No se ha detectado ninguna cámara');
    }
    try {
      setIsRecording(true);
      const video = await CameraService.startRecording(
        cameraRef as React.RefObject<CameraView>,
        opts
      );
      return video;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al grabar video';
      setError(message);
      return null;
    } finally {
      setIsRecording(false);
    }
  }, []);

  const stopRecording = useCallback(() => {
    CameraService.stopRecording(cameraRef as React.RefObject<CameraView>);
    setIsRecording(false);
  }, []);

  const toggleFacing = useCallback(() => {
    setFacing((prev) => CameraService.toggleFacing(prev));
  }, []);

  const toggleFlash = useCallback(() => {
    setFlashMode((prev) => CameraService.cycleFlashMode(prev));
  }, []);

  const saveToGallery = useCallback(async (uri: string) => {
    setError(null);
    try {
      await CameraService.saveToGallery(uri);
    } catch {
      setError('Error al guardar en galería');
    }
  }, []);

  return {
    cameraRef,
    permissions,
    isPermissionGranted,
    isLoadingPermissions,
    facing,
    flashMode,
    isRecording,
    requestPermissions,
    takePhoto,
    startRecording,
    stopRecording,
    toggleFacing,
    toggleFlash,
    saveToGallery,
    lastPhoto,
    error,
  };
}
