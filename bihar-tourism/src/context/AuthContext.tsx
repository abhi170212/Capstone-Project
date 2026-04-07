'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  _id: string;
  name: string;
  email: string;
  role?: 'user' | 'admin';
  token?: string;
  favorites?: string[];
  createdTrips?: string[];
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isLoading: boolean;
  updateUser: (data: Partial<User>) => void;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user info");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('userInfo', JSON.stringify(userData));
  };

  const refreshUserData = async () => {
    if (!user?.token) return;
    
    try {
      const api = (await import('@/lib/api')).default;
      const response = await api.get('/users/dashboard');
      const updatedUser = {
        ...user,
        ...response.data,
        token: user.token // Keep the token
      };
      setUser(updatedUser);
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...data };
      setUser(updated);
      localStorage.setItem('userInfo', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, updateUser, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const isAdmin = (user: User | null): boolean => {
  return user?.role === 'admin';
};
