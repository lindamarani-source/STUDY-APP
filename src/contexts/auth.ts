import { createContext } from 'react';

export interface AppUser {
  email: string | null;
}

export interface AuthContextType {
  currentUser: AppUser | null;
  loading: boolean;
  authError: string | null;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
