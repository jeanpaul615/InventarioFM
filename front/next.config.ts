import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export", // Comentado para permitir modo servidor
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // Configuración para desarrollo
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
