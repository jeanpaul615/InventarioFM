"use client";
import { useEffect, useState } from 'react';
import { useApi } from '../context/ApiContext';

export default function ConnectionTest() {
  const { baseUrl } = useApi();
  const [status, setStatus] = useState<'testing' | 'success' | 'error'>('testing');
  const [message, setMessage] = useState('Probando conexión...');

  useEffect(() => {
    const testConnection = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`${baseUrl}/`, {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          setStatus('success');
          setMessage('✅ Conexión exitosa al backend');
        } else {
          setStatus('error');
          setMessage(`❌ Error: ${response.status} ${response.statusText}`);
        }
      } catch (error: any) {
        setStatus('error');
        if (error.name === 'AbortError') {
          setMessage('❌ Tiempo de espera agotado (5s)');
        } else {
          setMessage(`❌ Error de conexión: ${error.message}`);
        }
      }
    };

    testConnection();
  }, [baseUrl]);

  if (status === 'testing') {
    return (
      <div className="no-print fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>{message}</span>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="no-print fixed bottom-4 right-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg max-w-md z-50">
        <p className="font-bold">{message}</p>
        <p className="text-sm mt-1">Backend: {baseUrl}</p>
        <p className="text-xs mt-2">Verifica que el servidor esté corriendo</p>
      </div>
    );
  }

  return (
    <div className="no-print fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
      {message}
    </div>
  );
}
