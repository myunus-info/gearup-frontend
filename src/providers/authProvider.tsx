'use client';

import { getMe, loginUser, logoutUser, registerUser } from '@/api/auth.api';
import type { LoginPayload, RegisterPayload, Role, User } from '@/types';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload, redirectTo?: string) => Promise<boolean>;
  demoLogin: (role: Role) => Promise<boolean>;
  register: (payload: RegisterPayload) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (updatedData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const handleTokens = useCallback((accessToken: string, refreshToken?: string) => {
    localStorage.setItem('accessToken', accessToken);
    Cookies.set('accessToken', accessToken, { expires: 1, path: '/' });
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
      Cookies.set('refreshToken', refreshToken, { expires: 7, path: '/' });
    }
  }, []);

  const clearTokens = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    Cookies.remove('accessToken', { path: '/' });
    Cookies.remove('refreshToken', { path: '/' });
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await getMe();
      if (res?.data) {
        setUser(res.data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (payload: LoginPayload, redirectTo?: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const res = await loginUser(payload);
      if (res?.data) {
        handleTokens(res.data.accessToken, res.data.refreshToken);
        setUser(res.data.user);
        toast.success(`Welcome back, ${res.data.user.name}!`);

        if (redirectTo) {
          router.push(redirectTo);
        } else {
          switch (res.data.user.role) {
            case 'ADMIN':
              router.push('/dashboard/admin');
              break;
            case 'PROVIDER':
              router.push('/dashboard/provider');
              break;
            default:
              router.push('/dashboard/customer');
              break;
          }
        }
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.message || 'Login failed. Please check your credentials.',
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = async (role: Role): Promise<boolean> => {
    let email = 'customer@gearup.com';
    if (role === 'ADMIN') email = 'admin@gearup.com';
    if (role === 'PROVIDER') email = 'provider@gearup.com';

    return login({ email, password: 'Password123!' });
  };

  const register = async (payload: RegisterPayload): Promise<boolean> => {
    try {
      setIsLoading(true);
      const res = await registerUser(payload);
      if (res?.data) {
        toast.success('Registration successful! Please sign in with your new account.');
        router.push('/auth/login');
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || 'Registration failed.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutUser().catch(() => null);
    } finally {
      clearTokens();
      setUser(null);
      toast.info('Signed out successfully.');
      router.push('/');
    }
  };

  const updateUser = (updatedData: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updatedData } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        demoLogin,
        register,
        logout,
        refreshUser,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
