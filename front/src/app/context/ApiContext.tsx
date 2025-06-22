"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

interface ApiContextProps {
  baseUrl: string;
  token: string | null;
  user: any;
  setToken: (token: string | null) => void;
  setUser: (user: any) => void;
  logout: () => void;
}

const ApiContext = createContext<ApiContextProps | undefined>(undefined);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    const u = localStorage.getItem('user');
    setUser(u ? JSON.parse(u) : null);
  }, []);

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const apiConfig = {
    baseUrl: 'http://localhost:8000',
    token,
    user,
    setToken,
    setUser,
    logout,
  };

  return <ApiContext.Provider value={apiConfig}>{children}</ApiContext.Provider>;
};

export const useApi = (): ApiContextProps => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};
