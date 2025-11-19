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
  const [baseUrl, setBaseUrl] = useState<string>('http://192.168.0.109:8000');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Marcar que estamos en el cliente
    setIsClient(true);
    
    // Cargar datos de localStorage
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken) setToken(storedToken);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing user from localStorage', e);
      }
    }

    // Detectar la URL base según el hostname
    const hostname = window.location.hostname;
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      // Si accedemos desde la red local, usar la misma IP
      setBaseUrl(`http://${hostname}:8000`);
    } else {
      // Si es localhost, usar la IP de red para que funcione en todos lados
      setBaseUrl('http://192.168.0.109:8000');
    }
  }, []);

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const apiConfig = {
    baseUrl,
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
