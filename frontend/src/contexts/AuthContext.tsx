import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI, profileAPI } from '../lib/api';
import {
  authInvalidatedEvent,
  clearStoredAuth,
  getStoredToken,
  getStoredUser,
  invalidateStoredAuth,
  parseJwtPayload,
  persistAuth,
} from '../utils/authStorage';

interface User {
  id: string;
  email: string;
  username?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (email: string, password: string, username: string) => Promise<User>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = getStoredUser();
    const token = getStoredToken();
    const tokenPayload = token ? parseJwtPayload(token) : null;

    if (storedUser && tokenPayload?.id === storedUser.id) {
      const isExpired = tokenPayload.exp ? tokenPayload.exp * 1000 <= Date.now() : false;

      if (!isExpired) {
        setUser(storedUser);
      } else {
        clearStoredAuth();
      }
    } else if (storedUser || token) {
      clearStoredAuth();
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    const handleAuthInvalidation = () => {
      setUser(null);
    };

    window.addEventListener(authInvalidatedEvent, handleAuthInvalidation);
    return () => window.removeEventListener(authInvalidatedEvent, handleAuthInvalidation);
  }, []);

  const value = {
    user,
    loading,
    signIn: async (email: string, password: string) => {
      try {
        const response = await authAPI.login({ email, password });
        const tokenPayload = parseJwtPayload(response.token);
        if (!tokenPayload?.id) {
          throw new Error('Invalid token payload');
        }

        const userInfo = {
          id: tokenPayload.id,
          email: email,
        };

        persistAuth(response.token, userInfo);
        profileAPI.ensureUser(userInfo.id, email);
        setUser(userInfo);
        return userInfo;
      } catch (error) {
        invalidateStoredAuth();
        throw new Error('Invalid credentials');
      }
    },
    signUp: async (email: string, password: string, username: string) => {
      try {
        const response = await authAPI.register({ email, password, username });
        const tokenPayload = parseJwtPayload(response.token);
        if (!tokenPayload?.id) {
          throw new Error('Invalid token payload');
        }

        const userInfo = {
          id: tokenPayload.id,
          email: email,
          username: username,
        };

        persistAuth(response.token, userInfo);
        profileAPI.ensureUser(userInfo.id, email);
        setUser(userInfo);
        return userInfo;
      } catch (error) {
        invalidateStoredAuth();
        throw new Error('Failed to create account');
      }
    },
    signOut: async () => {
      setUser(null);
      clearStoredAuth();
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
