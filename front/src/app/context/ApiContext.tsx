"use client";
import React, { createContext, useContext } from 'react';

interface ApiContextProps {
  baseUrl: string;
}

const ApiContext = createContext<ApiContextProps | undefined>(undefined);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const apiConfig = {
    baseUrl: 'http://localhost:8005',
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
