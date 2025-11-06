import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import React from 'react';
import { ApiProvider } from './context/ApiContext';
import ClientOnly from './components/ClientOnly';
import ConnectionTest from './components/ConnectionTest';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Inventario Ferremolina",
  description: "FerreMolina inventory management system",
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-amber-50 text-gray-900`}
        suppressHydrationWarning
      >
        <ClientOnly>
          <ApiProvider>
            <Navbar />
            {/* Ajustar padding según el tamaño del navbar */}
            <div className="mx-auto pt-14 sm:pt-16 md:pt-20 bg-amber-50 min-h-screen">
              {children}
            </div>
            {/* Componente de diagnóstico - Solo en desarrollo */}
            {process.env.NODE_ENV === 'development' && <ConnectionTest />}
          </ApiProvider>
        </ClientOnly>
      </body>
    </html>
  );
};

export default Layout;