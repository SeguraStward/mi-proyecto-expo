import * as FileSystem from 'expo-file-system/legacy';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
    updateDoc,
    where,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import type { PlantDocument, UpdatePlantDTO } from '@/src/types-dtos/plant.types';
import type { UpdateUserDTO, UserDocument } from '@/src/types-dtos/user.types';
import { db, storage } from './firebase';

/**
 * Convierte una cadena base64 a Uint8Array.
 * Usa atob (disponible en Hermes) en lugar de Buffer/Blob
 * para compatibilidad con React Native + Firebase JS SDK.
 */
function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function uploadImageToStorage(path: string, imageUri: string): Promise<string> {
  const storageRef = ref(storage, path);

  let base64: string;
  let contentType = 'image/jpeg';

  if (imageUri.startsWith('data:')) {
    // Extraer mime type y base64 del data URL
    const match = imageUri.match(/^data:(.+?);base64,(.+)$/s);
    if (!match) throw new Error('Formato data URL invalido');
    contentType = match[1];
    base64 = match[2];
  } else {
    // Leer archivo local como base64
    base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
  }

  // uploadBytes con Uint8Array funciona en React Native (sin Blob ni uploadString)
  const bytes = base64ToUint8Array(base64);
  await uploadBytes(storageRef, bytes, { contentType });
  return getDownloadURL(storageRef);
}

// ── Users ───────────────────────────────────────────────────────────────

export async function getUserById(uid: string): Promise<UserDocument | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return snap.data() as UserDocument;
}

export async function updateUser(uid: string, data: UpdateUserDTO): Promise<void> {
  await updateDoc(doc(db, 'users', uid), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

// ── Plants ──────────────────────────────────────────────────────────────

export async function getPlantsByUser(uid: string): Promise<PlantDocument[]> {
  const q = query(collection(db, 'plants'), where('userId', '==', uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as PlantDocument);
}

export async function getPlantById(plantId: string): Promise<PlantDocument | null> {
  const snap = await getDoc(doc(db, 'plants', plantId));
  if (!snap.exists()) return null;
  return snap.data() as PlantDocument;
}

export async function updatePlant(plantId: string, data: UpdatePlantDTO): Promise<void> {
  await updateDoc(doc(db, 'plants', plantId), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

/** Crea el documento si no existe, o lo actualiza si ya existe. */
export async function upsertPlant(plantId: string, data: Partial<PlantDocument>): Promise<void> {
  await setDoc(doc(db, 'plants', plantId), {
    ...data,
    id: plantId,
    updatedAt: new Date().toISOString(),
  }, { merge: true });
}

/**
 * Sube una foto al Firebase Storage y retorna la URL de descarga permanente.
 * Funciona con URIs locales (file://) y data URLs (base64) de cualquier plataforma.
 */
export async function uploadPlantPhoto(plantId: string, photoUri: string): Promise<string> {
  return uploadImageToStorage(`plants/${plantId}/${Date.now()}.jpg`, photoUri);
}

export async function uploadUserAvatar(uid: string, avatarUri: string): Promise<string> {
  return uploadImageToStorage(`users/${uid}/avatar_${Date.now()}.jpg`, avatarUri);
}

/** Elimina una planta por su ID. */
export async function deletePlant(plantId: string): Promise<void> {
  await deleteDoc(doc(db, 'plants', plantId));
}

/** Crea una nueva planta y retorna su ID generado. */
export async function createPlant(data: Omit<PlantDocument, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'plants'), {
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  await setDoc(ref, { id: ref.id }, { merge: true });
  return ref.id;
}
