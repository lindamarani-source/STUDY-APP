import { useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth, firebaseConfigError } from '../config/firebase';
import { AuthContext } from './auth';

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(auth));

  useEffect(() => {
    if (!auth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user ? { email: user.email } : null);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function signup(email, password) {
    if (!auth) {
      setCurrentUser({ email });
      return;
    }

    await createUserWithEmailAndPassword(auth, email, password);
  }

  async function login(email, password) {
    if (!auth) {
      setCurrentUser({ email });
      return;
    }

    await signInWithEmailAndPassword(auth, email, password);
  }

  async function logout() {
    if (!auth) {
      setCurrentUser(null);
      return;
    }

    await signOut(auth);
  }

  async function loginWithGoogle() {
    if (!auth) {
      setCurrentUser({ email: 'demo@study-manager.local' });
      return;
    }

    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  }

  const value = {
    currentUser,
    loading,
    authError: firebaseConfigError,
    signup,
    login,
    logout,
    loginWithGoogle,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
