// Configuración de URLs de la API
export const getApiUrl = (): string => {
  // Si estamos en el navegador
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // Si accedemos desde la red local, usar la misma IP
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `http://${hostname}:8000`;
    }
  }
  
  // Variable de entorno o IP por defecto
  return process.env.NEXT_PUBLIC_API_URL || 'http://192.168.0.109:8000';
};

export const API_URL = getApiUrl();
