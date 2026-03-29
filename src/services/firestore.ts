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
import { getDownloadURL, ref, uploadBytes, uploadString } from 'firebase/storage';

import type { PlantDocument, UpdatePlantDTO } from '@/src/types-dtos/plant.types';
import type { UpdateUserDTO, UserDocument } from '@/src/types-dtos/user.types';
import { db, storage } from './firebase';

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
  const photoRef = ref(storage, `plants/${plantId}/${Date.now()}.jpg`);

  if (photoUri.startsWith('data:')) {
    // Web: base64 data URL — uploadString es el metodo correcto para este formato
    await uploadString(photoRef, photoUri, 'data_url');
  } else {
    // Native: file:// URI — convertir a blob con fetch
    const response = await fetch(photoUri);
    const blob = await response.blob();
    await uploadBytes(photoRef, blob);
  }

  return getDownloadURL(photoRef);
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
