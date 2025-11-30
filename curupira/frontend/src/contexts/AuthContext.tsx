import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AuthResponse, LoginPayload, UserProfile } from '~/apis';
import { accountApi } from '~/apis';
import { LocalStorage } from '~/types/enums/LocalStorage.enum';
import { decodeJwt } from '~/utils/helpers/decodeJwt.helper';

type AuthContextValue = {
  token: string | null;
  userId: number | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

const parseStoredAuth = (stored: string | null): AuthResponse | null => {
  if (!stored) return null;
  try {
    return JSON.parse(stored) as AuthResponse;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);

  // Carrega estado inicial do localStorage
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(LocalStorage.authToken);
      const auth = parseStoredAuth(stored);
      if (auth?.token) {
        try {
          const payload = decodeJwt(auth.token) as { user_id?: number; exp?: number };
          if (payload?.exp && payload.exp * 1000 < Date.now()) {
            // Token expirado
            window.localStorage.removeItem(LocalStorage.authToken);
            return;
          }
          setToken(auth.token);
          setUserId(typeof payload.user_id === 'number' ? payload.user_id : null);
        } catch {
          // Se der erro ao decodificar, limpa o storage
          window.localStorage.removeItem(LocalStorage.authToken);
        }
      }
    } catch {
      // Ignora erros de acesso ao localStorage
    }
  }, []);

  const persistAuth = useCallback((auth: AuthResponse | null) => {
    try {
      if (!auth) {
        window.localStorage.removeItem(LocalStorage.authToken);
        return;
      }
      window.localStorage.setItem(LocalStorage.authToken, JSON.stringify(auth));
    } catch {
      // Silencia erros de storage
    }
  }, []);

  const loadUserProfile = useCallback(async () => {
    try {
      const profile = await accountApi.me();
      setUser(profile);
      try {
        window.localStorage.setItem(LocalStorage.authUser, JSON.stringify(profile));
      } catch {
        // ignore
      }
    } catch {
      setUser(null);
      try {
        window.localStorage.removeItem(LocalStorage.authUser);
      } catch {
        // ignore
      }
    }
  }, []);

  const login = useCallback(
    async (payload: LoginPayload) => {
      const auth = await accountApi.login(payload);
      setToken(auth.token);

      try {
        const decoded = decodeJwt(auth.token) as { user_id?: number };
        setUserId(typeof decoded.user_id === 'number' ? decoded.user_id : null);
      } catch {
        setUserId(null);
      }

      persistAuth(auth);
      await loadUserProfile();
    },
    [persistAuth, loadUserProfile],
  );

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setUser(null);
    persistAuth(null);
    try {
      window.localStorage.removeItem(LocalStorage.authUser);
    } catch {
      // ignore
    }
  }, [persistAuth]);

  // Carrega o perfil se já houver token ao montar
  useEffect(() => {
    if (token) {
      loadUserProfile();
    }
  }, [token, loadUserProfile]);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      userId,
      user,
      isAuthenticated: !!token,
      login,
      logout,
    }),
    [token, userId, user, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return ctx;
};
