import { auth, db } from '@/src/services/firebase';
import {
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithCredential,
    signInWithEmailAndPassword,
    signOut,
    type User,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (displayName: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function buildUsername(displayName: string, email: string, uid: string): string {
  const base = (displayName || email.split('@')[0] || 'grower')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 12);

  return `${base || 'grower'}_${uid.slice(0, 6)}`;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email.trim(), password);
  };

  const register = async (displayName: string, email: string, password: string) => {
    const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const { uid } = credential.user;
    const username = buildUsername(displayName, email, uid);

    await setDoc(doc(db, 'users', uid), {
      id: uid,
      username,
      displayName: displayName.trim() || username,
      profile: {
        bio: 'Nuevo cultivador en Pixel Garden.',
        avatarUrl: '',
      },
      contactInfo: {
        instagram: '',
        whatsapp: '',
      },
      location: {
        country: '',
        province: '',
      },
      gamification: {
        level: 1,
        levelName: 'Semilla Curiosa',
        currentXP: 0,
        totalXP: 0,
        nextLevelXP: 200,
        dailyStreak: 0,
        badges: [],
      },
      social: {
        enraizados: [],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      authUid: uid,
      email: email.trim().toLowerCase(),
    }, { merge: true });
  };

  const loginWithGoogle = async (idToken: string) => {
    const credential = GoogleAuthProvider.credential(idToken);
    const result = await signInWithCredential(auth, credential);
    const { uid, displayName: dn, email: em, photoURL } = result.user;

    // Crear doc en Firestore solo si es usuario nuevo
    const userRef = doc(db, 'users', uid);
    const existing = await getDoc(userRef);
    if (!existing.exists()) {
      const username = buildUsername(dn ?? '', em ?? '', uid);
      await setDoc(userRef, {
        id: uid,
        username,
        displayName: dn?.trim() || username,
        email: em?.toLowerCase() ?? '',
        profile: {
          bio: 'Nuevo cultivador en Pixel Garden.',
          avatarUrl: photoURL ?? '',
        },
        contactInfo: { instagram: '', whatsapp: '' },
        location: { country: '', province: '' },
        gamification: {
          level: 1,
          levelName: 'Semilla Curiosa',
          currentXP: 0,
          totalXP: 0,
          nextLevelXP: 200,
          dailyStreak: 0,
          badges: [],
        },
        social: { enraizados: [] },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        authUid: uid,
      });
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, isLoading, user, login, register, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
