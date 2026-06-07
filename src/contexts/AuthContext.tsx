import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, LoginRequest, LoginResponse } from '@/types';

const STORAGE_KEY = 'quanxianguanli_token';

const mockUsers: Record<string, { password: string; user: User }> = {
  admin: {
    password: 'admin123',
    user: { id: '1', username: 'admin', role: 'admin' },
  },
  user: {
    password: 'user123',
    user: { id: '2', username: 'user', role: 'user' },
  },
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<LoginResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEY);
    if (token) {
      const parts = token.split(':');
      if (parts.length === 2) {
        const username = parts[0];
        const storedUser = mockUsers[username];
        if (storedUser) {
          setUser(storedUser.user);
        }
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback((credentials: LoginRequest): Promise<LoginResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const storedUser = mockUsers[credentials.username];
        if (storedUser && storedUser.password === credentials.password) {
          const token = `${credentials.username}:${Date.now()}`;
          localStorage.setItem(STORAGE_KEY, token);
          setUser(storedUser.user);
          resolve({
            success: true,
            token,
            user: storedUser.user,
          });
        } else {
          resolve({
            success: false,
            token: '',
            user: {} as User,
          });
        }
      }, 500);
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
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
