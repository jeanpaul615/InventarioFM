import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import React from 'react';
import { ApiProvider } from './context/ApiContext';

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
    <ApiProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-amber-50 text-gray-900`}
        >
          <Navbar />
          <div className="mx-auto pt-16 bg-amber-50">
            {children}
          </div>
        </body>
      </html>
    </ApiProvider>
  );
};

export default Layout;