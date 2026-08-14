"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Role } from "@/lib/types";
import {
  api,
  clearStoredAuth,
  getStoredToken,
  getStoredUser,
  setStoredAuth,
} from "@/lib/api-client";
import { MOCK_USERS } from "@/lib/mock-data";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  role: Role | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (payload: {
    name: string;
    email: string;
    password: string;
    role: Role;
    phone?: string;
    address?: string;
    shopName?: string;
  }) => Promise<boolean>;
  logout: () => void;
  switchDemoUser: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = getStoredToken();
        const storedUser = getStoredUser();

        if (storedUser && storedToken) {
          setUser(storedUser);
        } else if (!storedUser) {
          // Default to demo customer on fresh session for instant browsing & testing
          const defaultCustomer = MOCK_USERS[0];
          setStoredAuth("mock-customer-token", defaultCustomer);
          setUser(defaultCustomer);
        }
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await api.auth.login({ email, password });
      if (res.success && res.data) {
        setUser(res.data.user);
        toast.success(`Welcome back, ${res.data.user.name}!`);

        // Route to corresponding dashboard
        if (res.data.user.role === "ADMIN") {
          router.push("/dashboard/admin");
        } else if (res.data.user.role === "PROVIDER") {
          router.push("/dashboard/provider");
        } else {
          router.push("/dashboard/customer");
        }
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.message || "Failed to login");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: {
    name: string;
    email: string;
    password: string;
    role: Role;
    phone?: string;
    address?: string;
    shopName?: string;
  }): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await api.auth.register(payload);
      if (res.success && res.data) {
        setUser(res.data.user);
        toast.success("Account created successfully!");
        if (res.data.user.role === "PROVIDER") {
          router.push("/dashboard/provider");
        } else {
          router.push("/dashboard/customer");
        }
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearStoredAuth();
    setUser(null);
    toast.info("Logged out successfully");
    router.push("/");
  };

  const switchDemoUser = (targetRole: Role) => {
    const demoUser =
      MOCK_USERS.find((u) => u.role === targetRole) || MOCK_USERS[0];
    setStoredAuth(`mock-${targetRole.toLowerCase()}-token`, demoUser);
    setUser(demoUser);
    toast.success(`Switched active profile to ${demoUser.name} (${targetRole})`);

    if (targetRole === "ADMIN") {
      router.push("/dashboard/admin");
    } else if (targetRole === "PROVIDER") {
      router.push("/dashboard/provider");
    } else {
      router.push("/dashboard/customer");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        switchDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
